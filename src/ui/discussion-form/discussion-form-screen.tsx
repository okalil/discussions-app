import React from 'react';
import { View, ToastAndroid } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { DiscussionsRepository } from '~/data/discussions-repository';
import { FormInput } from '~/components/forms/form-input';
import { Fab } from '~/components/fab';
import { FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

const repository = new DiscussionsRepository();

type ScreenProps = NativeStackScreenProps<StackParamList>;

export function DiscussionFormScreen({ navigation }: ScreenProps) {
  const client = useQueryClient();
  const form = useForm({ defaultValues: { title: '', description: '' } });

  const onSaveDiscussion = form.handleSubmit(async data => {
    try {
      const discussionId = await repository.createDiscussion(data);
      client.invalidateQueries({ queryKey: ['discussions'] });
      navigation.navigate('Discussion', { id: discussionId });
    } catch (error: any) {
      ToastAndroid.show(error.message || 'Erro ao salvar', 1200);
      form.setError('root', { message: 'Erro ao salvar' });
    }
  });

  return (
    <FormProvider {...form}>
      <View className="flex-1 px-4 py-4">
        <FormInput
          label="Título"
          name="title"
          nextFocusDown="description"
          rules={{ required: 'Insira o título' }}
          className="mb-4"
        />
        <FormInput
          label="Descrição"
          multiline
          name="description"
          rules={{ required: 'Insira o título' }}
        />

        <Fab
          onPress={onSaveDiscussion}
          icon={<Icon name="check" color="white" size={24} />}
        />
      </View>
    </FormProvider>
  );
}
