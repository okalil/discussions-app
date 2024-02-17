import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, View, ToastAndroid } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UserRepository } from '~/data/user-repository';
import { FormInput } from '~/ui/shared/form-input';
import { Button } from '~/ui/shared/button';
import { Text } from '../shared/text';

function useRegisterMutation() {
  const client = useQueryClient();
  return useMutation({
    async mutationFn(data: object) {
      const repository = new UserRepository();
      await repository.register(data);
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['user'] }),
  });
}

export function RegisterScreen({
  navigation,
}: NativeStackScreenProps<StackParamList>) {
  const form = useForm();
  const mutation = useRegisterMutation();

  const onRegister = form.handleSubmit(async data => {
    mutation.mutate(data, {
      onError: error =>
        ToastAndroid.show(error.message || 'Erro ao Cadastrar', 1200),
    });
  });

  return (
    <FormProvider {...form}>
      <SafeAreaView className="flex-1 px-8 justify-center">
        <Text className="font-inter-semibold text-3xl text-center mb-8">
          Criar conta
        </Text>

        <FormInput
          label="Nome"
          name="name"
          className="mb-6"
          nextFocusDown="email"
          rules={{ required: 'Preencha esse campo' }}
        />
        <FormInput.Email
          label="E-mail"
          name="email"
          className="mb-6"
          nextFocusDown="password"
          rules={{ required: 'Preencha esse campo' }}
        />
        <FormInput.Password
          label="Senha"
          name="password"
          className="mb-6"
          nextFocusDown="password_confirmation"
          rules={{ required: 'Preencha esse campo' }}
        />
        <FormInput.Password
          label="Confirmar senha"
          name="password_confirmation"
          className="mb-8"
          onSubmitEditing={onRegister}
          rules={{
            required: 'Preencha esse campo',
            validate(value, values) {
              return (
                values?.password === value ||
                'Confirmação de senha deve ser igual à senha'
              );
            },
          }}
        />

        <Button
          variant="primary"
          className="h-12 mb-8"
          loading={mutation.isPending}
          onPress={onRegister}
        >
          Criar
        </Button>

        <View className="flex-row justify-center">
          <Text className="">Já tem uma conta? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text className=" underline">Entrar agora</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </FormProvider>
  );
}
