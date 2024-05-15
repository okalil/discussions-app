import { Pressable, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormProvider, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RegisterDto } from '~/data/user/register.dto';
import { Button } from '~/ui/shared/button';
import { FormInput } from '~/ui/shared/form-input';
import { Text } from '../shared/text';
import { Toast } from '../shared/toast';
import { useRegisterMutation } from './queries/use-register-mutation';

export function RegisterScreen({
  navigation,
}: NativeStackScreenProps<StackParamList>) {
  const form = useForm<RegisterDto>();
  const mutation = useRegisterMutation();

  const onRegister = form.handleSubmit(async data => {
    mutation.mutate(data, {
      onSuccess: () =>
        Toast.show('Cadastrado realizado com sucesso!', Toast.LONG),
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
