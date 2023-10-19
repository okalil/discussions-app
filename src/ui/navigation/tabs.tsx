import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { DiscussionsScreen } from '../discussions/discussions-screen';
import { ProfileScreen } from '../profile/profile-screen';

const Tab = createBottomTabNavigator();

export function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tab.Screen
        name="Discussions"
        component={DiscussionsScreen}
        options={{
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
