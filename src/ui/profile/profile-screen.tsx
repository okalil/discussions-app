import { View, Text } from 'react-native';
import { useUserQuery } from '../navigation/use-user-query';

export function ProfileScreen() {
  const { data: user } = useUserQuery();

  if (!user) {
    return <Text>Sem dados</Text>;
  }

  return (
    <View>
      <Text>Perfil</Text>
      <Text>{user.name}</Text>
    </View>
  );
}
