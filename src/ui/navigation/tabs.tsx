import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

import { DiscussionsScreen } from '../discussions/discussions-screen';
import { ProfileLogoutButton, ProfileScreen } from '../profile/profile-screen';

export const Tabs = createBottomTabNavigator({
  tabBar: TabBar,
  screenOptions: { tabBarShowLabel: false },
  screens: {
    Discussions: {
      screen: DiscussionsScreen,
      options: {
        headerShown: false,
        tabBarAccessibilityLabel: 'Início',
        tabBarIcon(props) {
          return (
            <Icon name={props.focused ? 'home' : 'home-outline'} size={24} />
          );
        },
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
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
      },
    },
  },
});

function TabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
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
}
