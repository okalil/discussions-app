import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from './ui/auth/login-screen';
import { RegisterScreen } from './ui/auth/register-screen';

const Stack = createNativeStackNavigator();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

declare global {
  type StackParamList = {
    Login: undefined;
    Register: undefined;
  };
}
