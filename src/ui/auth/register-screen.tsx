import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, Text, View, ToastAndroid } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { UserRepository } from '~/data/user-repository';
import { FormInput } from '~/components/forms/form-input';
import { Button } from '~/components/button';

export function RegisterScreen({
  navigation,
}: NativeStackScreenProps<StackParamList>) {
  const client = useQueryClient();
  const form = useForm();

  const onRegister = form.handleSubmit(async data => {
    try {
      const repository = new UserRepository();
      await repository.register(data);
      await client.invalidateQueries({ queryKey: ['user'] });
    } catch (error: any) {
      ToastAndroid.show(error.message || 'Erro ao Cadastrar', 1200)
      form.setError('root', { message: 'Erro ao Cadastrar' });
    }
  });

  return (
    <FormProvider {...form}>
      <View className="flex-1 px-8 justify-center">
        <Text className="font-semibold text-3xl text-center mb-8">
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
          loading={form.formState.isSubmitting}
          onPress={onRegister}
        >
          Criar
        </Button>

        <View className="flex-row justify-center">
          <Text>Já tem uma conta? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text className="underline">Entrar agora</Text>
          </Pressable>
        </View>
      </View>
    </FormProvider>
  );
}
