import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, View, ToastAndroid } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '~/ui/shared/text';
import { Button } from '~/ui/shared/button';
import { FormInput } from '~/ui/shared/form-input';
import { useLoginMutation } from '../queries/use-login-mutation';

export function LoginScreen({
  navigation,
}: NativeStackScreenProps<StackParamList>) {
  const form = useForm();
  const mutation = useLoginMutation();

  const onLogin = form.handleSubmit(async data => {
    mutation.mutate(data, {
      onError: error =>
        ToastAndroid.show(error.message || 'Erro ao Entrar', 1200),
    });
  });

  return (
    <FormProvider {...form}>
      <SafeAreaView className="flex-1 px-8 justify-center">
        <Text className="font-inter-semibold text-3xl text-center mb-8">
          Entrar
        </Text>

        <FormInput.Email
          label="E-mail"
          name="email"
          className="mb-6"
          nextFocusDown="password"
        />
        <FormInput.Password
          label="Senha"
          name="password"
          className="mb-8"
          onSubmitEditing={onLogin}
        />

        <Button
          variant="primary"
          className="h-12 mb-8"
          loading={mutation.isPending}
          onPress={onLogin}
        >
          Entrar
        </Button>

        <View className="flex-row justify-center ">
          <Text className="">Novo por aqui? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text className="underline">Cadastre-se agora</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </FormProvider>
  );
}
