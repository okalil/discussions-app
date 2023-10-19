import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../auth/login-screen';
import { RegisterScreen } from '../auth/register-screen';
import { Tabs } from './tabs';
import { useUserQuery } from './use-user-query';

const Stack = createNativeStackNavigator();

export function NavigationStack() {
  const isAuthenticated = useUserQuery(user => !!user).data;

  return (
    <Stack.Navigator>
      {!isAuthenticated && (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      )}
      {isAuthenticated && (
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={Tabs}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

declare global {
  type StackParamList = {
    Login: undefined;
    Register: undefined;
  };
}
