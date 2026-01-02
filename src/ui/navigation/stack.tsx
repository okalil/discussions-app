import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import type { StaticParamList } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../auth/login-screen';
import { RegisterScreen } from '../auth/register-screen';
import { DiscussionScreen } from '../discussion/discussion-screen';
import { DiscussionFormScreen } from '../discussions/discussion-form-screen';
import {
  useIsAuthenticated,
  useIsUnauthenticated,
  useOptionalUserQuery,
} from '../shared/queries/use-user-query';
import { Tabs } from './tabs';

const Stack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  groups: {
    public: {
      if: useIsUnauthenticated,
      screens: {
        Login: LoginScreen,
        Register: RegisterScreen,
      },
    },
    protected: {
      if: useIsAuthenticated,
      screens: {
        Home: Tabs,
        Discussion: DiscussionScreen,
        DiscussionForm: {
          screen: DiscussionFormScreen,
          options: { title: 'Nova Discussão', presentation: 'formSheet' },
        },
      },
    },
  },
});
const StaticNavigation = createStaticNavigation(Stack);

interface Props {
  onReady: () => void;
}
export function Navigation({ onReady }: Props) {
  const userQuery = useOptionalUserQuery();
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

  return <StaticNavigation onReady={onReady} />;
}

type StackParamList = StaticParamList<typeof Stack>;
declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}
