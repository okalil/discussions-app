# Autenticação

Fluxo de autenticação de usuário

### Dados e Gerenciamento de Estado

1. Interface para definir o modelo dos dados enviados

```tsx
export interface LoginDto {
  email: string;
  password: string;
}
```

2. Na classe de repositório, um método vai receber os dados do usuário e enviar a requisição à API HTTP.

```tsx
import { LoginDto } from './login.dto';

class UserRepository {
  async login(dto: LoginDto) {
    // Envia solicitação para API
    const body = JSON.stringify(dto);
    const response = await api.post('/api/v1/users/login', { body });
    const json = await response.json();

    // Persiste o token de autenticação no armazenamento local
    const token = json.token;
    storage.setItem('token', token);

    // ... Faça outras coisas se necessário
  }
}
```

3. Na camada de UI, um hook customizado abstrai o gerenciamento de estado da operação assíncrona.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRepository } from '~/data/user/user.repository';
import { LoginDto } from '~/data/user/login.dto';

export function useLoginMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDto) => new UserRepository().login(dto),
    onSuccess: () => client.invalidateQueries({ queryKey: ['user'] }),
  });
}
```

### Formulário e validação

No componente de formulário, o `useForm` gerencia o estado do formulário, e o `useLoginMutation` gerencia o estado da operação de login.

```tsx
export function LoginScreen({ navigation }) {
  const form = useForm<LoginDto>();
  const mutation = useLoginMutation();

  const onLogin = form.handleSubmit(data => {
    mutation.mutate(data, {
      onSuccess: () => Toast.show('Logado com sucesso'),
    });
  });

  return (
    <FormProvider {...form}>
      {/* ... outros elementos */}

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

      {/* ... outros elementos */}
    </FormProvider>
  );
}
```

### Navegação

As telas são renderizadas condicionalmente de acordo o estado dos dados do usuário.
Dessa forma, ao fazer login com sucesso, os dados do usuário são invalidados, e a tela "Login" é automaticamente substituída pela "Home".
```tsx
export function RootStack() {
  const user = useUser();
  const isAuthenticated = !!user;
  return (
    <Stack.Navigator>
      {!isAuthenticated && (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* ... Telas que não exigem estar autenticado */}
        </Stack.Group>
      )}
      {isAuthenticated && (
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={Tabs}
            options={{ headerShown: false }}
          />
          {/* ... Telas que exigem estar autenticado */}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
```
