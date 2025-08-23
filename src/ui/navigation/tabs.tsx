import { useEffect } from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { DiscussionsScreen } from '../discussions/discussions-screen';
import { ProfileLogoutButton, ProfileScreen } from '../profile/profile-screen';

export const Tabs = createBottomTabNavigator({
  tabBar: (props) => <TabBar {...props} />,
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

  const height = useSharedValue(tabBarVisible ? 48 : 0);

  useEffect(() => {
    height.value = withTiming(tabBarVisible ? 48 : 0, { duration: 250 });
  }, [tabBarVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    backgroundColor: 'blue',
    marginBottom: insets.bottom,
    overflow: 'hidden',
  }));

  return (
    <Animated.View style={animatedStyle}>
      <BottomTabBar {...props} />
    </Animated.View>
  );
}
