import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginScreen } from '../auth/login-screen';
import { RegisterScreen } from '../auth/register-screen';
import { DiscussionScreen } from '../discussion/discussion-screen';
import { DiscussionFormScreen } from '../discussion-form/discussion-form-screen';
import { useOptionalUserQuery } from '../shared/queries/use-user-query';
import { Tabs } from './tabs';

const Stack = createNativeStackNavigator();

interface Props {
  onReady: () => void;
}

export function Navigation({ onReady }: Props) {
  const insets = useSafeAreaInsets();
  const userQuery = useOptionalUserQuery();
  const isAuthenticated = !!userQuery.data;

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const fontsLoading = !fontsLoaded && !fontError;

  if (userQuery.isLoading || fontsLoading) {
    return null;
  }

  return (
    <NavigationContainer onReady={onReady}>
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
            <Stack.Screen name="Discussion" component={DiscussionScreen} />
            <Stack.Screen
              name="DiscussionForm"
              component={DiscussionFormScreen}
              options={{ title: 'Nova Discussão', presentation: 'formSheet' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

declare global {
  type StackParamList = {
    Login: undefined;
    Register: undefined;
    Discussion?: { id?: string };
    DiscussionForm: undefined;
  };
}
