import React from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import type { CreateDiscussionDto } from '~/data/discussion/create-discussion.dto';
import { getDiscussionRepository } from '~/data/discussion/discussion.repository';
import { Fab } from '~/ui/shared/fab';
import { FormInput } from '~/ui/shared/form-input';
import { FormTextarea } from '~/ui/shared/form-textarea';

export function DiscussionFormScreen({
  navigation,
}: NativeStackScreenProps<ReactNavigation.RootParamList>) {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (dto: CreateDiscussionDto) =>
      getDiscussionRepository().createDiscussion(dto),
    onSuccess: () => client.invalidateQueries({ queryKey: ['discussions'] }),
  });
  const form = useForm<CreateDiscussionDto>({
    defaultValues: { title: '', description: '' },
  });

  const onSaveDiscussion = form.handleSubmit(async (data) => {
    mutation.mutate(data, {
      onSuccess: (id) => navigation.replace('Discussion', { id }),
    });
  });

  return (
    <FormProvider {...form}>
      <KeyboardAwareScrollView
        className="px-4"
        contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <FormInput
          label="Título"
          name="title"
          nextFocusDown="description"
          rules={{ required: 'Insira o título' }}
          className="mb-4"
          autoFocus
        />
        <FormTextarea
          label="Descrição"
          name="description"
          rules={{ required: 'Insira o título' }}
        />
      </KeyboardAwareScrollView>
      <Fab
        onPress={onSaveDiscussion}
        icon={<Icon name="check" color="white" size={24} />}
        accessibilityLabel="Criar"
      />
    </FormProvider>
  );
}
