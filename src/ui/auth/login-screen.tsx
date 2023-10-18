import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '~/components/button';
import { FormInput } from '~/components/forms/form-input';
import { UserRepository } from '~/data/user-repository';

export function LoginScreen({
  navigation,
}: NativeStackScreenProps<StackParamList>) {
  const form = useForm();
  const onLogin = form.handleSubmit(async data => {
    try {
      const repository = new UserRepository();
      const user = await repository.login(data.user);
      console.log(user);
    } catch (error) {
      form.setError('root', { message: 'Erro ao Entrar' });
    }
  });

  return (
    <FormProvider {...form}>
      <View className="flex-1 px-8 justify-center">
        <Text className="font-semibold text-3xl text-center mb-8">Entrar</Text>

        <FormInput.Email
          label="E-mail"
          name="user.email"
          className="mb-6"
          nextFocusDown="user.password"
        />
        <FormInput.Password
          label="Senha"
          name="user.password"
          className="mb-8"
          onSubmitEditing={onLogin}
        />

        <Button
          variant="primary"
          className="h-12 mb-8"
          loading={form.formState.isSubmitting}
          onPress={onLogin}
        >
          Entrar
        </Button>

        <View className="flex-row justify-center">
          <Text>Novo por aqui? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text className="underline">Cadastre-se agora</Text>
          </Pressable>
        </View>
      </View>
    </FormProvider>
  );
}
