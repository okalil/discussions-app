import { Pressable } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { Text } from '~/ui/shared/text';
import { cn } from '~/ui/shared/utils/cn';

export interface VoteProps {
  voted?: boolean;
  votes: number;
  onPress: () => void;
}

export function Vote({ voted, votes, onPress }: VoteProps) {
  return (
    <Pressable
      className={cn(
        'flex-row items-center ml-auto',
        'px-2 py-1 border-[0.5px] rounded-xl',
        voted ? 'border-blue-500' : 'border-gray-300',
      )}
      style={{ minWidth: 48 }}
      onPress={onPress}
    >
      <Icon
        name="arrow-up"
        color={voted ? 'rgb(59 130 246)' : undefined}
        size={16}
      />
      <Text className={cn(voted && 'text-blue-500')}>{votes}</Text>
    </Pressable>
  );
}
