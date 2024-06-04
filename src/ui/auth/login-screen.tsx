import { Keyboard, KeyboardAvoidingView, Platform, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { FormProvider, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";

import type { LoginDto } from "~/data/user/login.dto";
import { Button } from "~/ui/shared/button";
import { FormInput } from "~/ui/shared/form-input";
import { Text } from "~/ui/shared/text";
import { Toast } from "~/ui/shared/toast";
import { useLoginMutation } from "./queries/use-login-mutation";

export function LoginScreen({
  navigation,
}: NativeStackScreenProps<StackParamList>) {
  const form = useForm<LoginDto>();
  const mutation = useLoginMutation();

  const onLogin = form.handleSubmit(async (data) => {
    mutation.mutate(data, {
      onSuccess: () => Toast.show("Logado com sucesso!", Toast.SHORT),
    });
  });

  return (
    <FormProvider {...form}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 px-8 justify-center">
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
              returnKeyType="go"
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
              <Pressable onPress={() => navigation.navigate("Register")}>
                <Text className="underline">Cadastre-se agora</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </FormProvider>
  );
}
