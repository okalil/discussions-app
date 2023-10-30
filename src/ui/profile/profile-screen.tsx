import { View, Text, Pressable } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { useUserQuery } from '../navigation/use-user-query';
import { UserRepository } from '~/data/user-repository';

const repository = new UserRepository();

export function ProfileScreen() {
  const { data: user, refetch } = useUserQuery();

  const onLogout = () => {
    repository.logout();
    refetch();
  };

  if (!user) {
    return <Text>Sem dados</Text>;
  }

  return (
    <View>
      <Text>Perfil</Text>
      <Text>{user.name}</Text>

      <Pressable onPress={onLogout}>
        <Icon name="logout" size={24} />
      </Pressable>
    </View>
  );
}
