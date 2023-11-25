import React from 'react';
import { ScrollView, ToastAndroid, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Fab } from '~/ui/shared/fab';
import { FormInput } from '~/ui/shared/form-input';
import { FormTextarea } from '~/ui/shared/form-textarea';
import { DiscussionsRepository } from '~/data/discussions-repository';

type ScreenProps = NativeStackScreenProps<StackParamList>;

export function DiscussionFormScreen({ navigation }: ScreenProps) {
  const client = useQueryClient();
  const form = useForm({ defaultValues: { title: '', description: '' } });

  const onSaveDiscussion = form.handleSubmit(async data => {
    try {
      const repository = new DiscussionsRepository();
      const discussionId = await repository.createDiscussion(data);
      client.invalidateQueries({ queryKey: ['discussions'] });
      navigation.replace('Discussion', { id: discussionId });
    } catch (error: any) {
      ToastAndroid.show(error.message || 'Erro ao salvar', 1200);
      form.setError('root', { message: 'Erro ao salvar' });
    }
  });

  return (
    <FormProvider {...form}>
      <View className="flex-1">
        <ScrollView className="px-4 py-4 my-4">
          <FormInput
            label="Título"
            name="title"
            nextFocusDown="description"
            rules={{ required: 'Insira o título' }}
            className="mb-4"
          />
          <FormTextarea
            label="Descrição"
            name="description"
            rules={{ required: 'Insira o título' }}
          />
        </ScrollView>

        <Fab
          onPress={onSaveDiscussion}
          icon={<Icon name="check" color="white" size={24} />}
        />
      </View>
    </FormProvider>
  );
}
