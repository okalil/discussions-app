import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { MotiView } from 'moti';

import { DiscussionsScreen } from '../discussions/discussions-screen';
import { ProfileScreen } from '../profile/profile-screen';

const Tab = createBottomTabNavigator();

export function Tabs() {
  return (
    <Tab.Navigator
      tabBar={props => {
        const route = props.state.routes[props.state.index];
        const params: Record<string, any> = route.params ?? {};
        const tabBarVisible = params?.tabBarVisible ?? true;
        return (
          <MotiView
            animate={{
              height: tabBarVisible ? 48 : 0,
              backgroundColor: 'blue',
            }}
            transition={{ type: 'timing', duration: 250 }}
          >
            <BottomTabBar {...props} />
          </MotiView>
        );
      }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Discussions"
        component={DiscussionsScreen}
        options={{
          tabBarAccessibilityLabel: "Início",
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
          tabBarAccessibilityLabel: "Perfil",
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
