import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '~/components/button';
import { FormInput } from '~/components/forms/form-input';

export function RegisterScreen({
  navigation,
}: NativeStackScreenProps<StackParamList>) {
  const form = useForm();
  const onRegister = form.handleSubmit(() => {});

  return (
    <FormProvider {...form}>
      <View className="flex-1 px-8 justify-center">
        <Text className="font-semibold text-3xl text-center mb-8">
          Criar conta
        </Text>

        <FormInput
          label="Nome"
          name="user.name"
          className="mb-6"
          nextFocusDown="user.email"
          rules={{ required: 'Preencha esse campo' }}
        />
        <FormInput.Email
          label="E-mail"
          name="user.email"
          className="mb-6"
          nextFocusDown="user.password"
          rules={{ required: 'Preencha esse campo' }}
        />
        <FormInput.Password
          label="Senha"
          name="user.password"
          className="mb-6"
          nextFocusDown="user.password_confirmation"
          rules={{ required: 'Preencha esse campo' }}
        />
        <FormInput.Password
          label="Confirmar senha"
          name="user.password_confirmation"
          className="mb-8"
          onSubmitEditing={onRegister}
          rules={{
            required: 'Preencha esse campo',
            validate(value, values) {
              return (
                values.user?.password === value ||
                'Confirmação de senha deve ser igual à senha'
              );
            },
          }}
        />

        <Button variant="primary" className="h-12 mb-8" onPress={onRegister}>
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
