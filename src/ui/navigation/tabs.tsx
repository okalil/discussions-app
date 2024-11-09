import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

import { DiscussionsScreen } from '../discussions/discussions-screen';
import { ProfileLogoutButton, ProfileScreen } from '../profile/profile-screen';

const Tab = createBottomTabNavigator();

export function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      tabBar={(props) => {
        const route = props.state.routes[props.state.index];
        const params: Record<string, any> = route.params ?? {};
        const tabBarVisible = params?.tabBarVisible ?? true;
        return (
          <MotiView
            animate={{
              height: tabBarVisible ? 48 : 0,
              backgroundColor: 'blue',
              marginBottom: insets.bottom,
            }}
            transition={{ type: 'timing', duration: 250 }}
          >
            <BottomTabBar {...props} />
          </MotiView>
        );
      }}
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Discussions"
        component={DiscussionsScreen}
        options={{
          headerShown: false,
          tabBarAccessibilityLabel: 'Início',
          tabBarIcon(props) {
            return (
              <Icon name={props.focused ? 'home' : 'home-outline'} size={24} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerRight: () => <ProfileLogoutButton />,
          tabBarAccessibilityLabel: 'Perfil',
          tabBarIcon(props) {
            return (
              <Icon
                name={props.focused ? 'account' : 'account-outline'}
                size={24}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

declare global {
  type TabParamList = {
    Discussions?: { tabBarVisible?: boolean };
  };
}
