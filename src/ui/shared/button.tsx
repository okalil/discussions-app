import type { PressableProps } from 'react-native';
import { Pressable, ActivityIndicator } from 'react-native';
import { Text } from './text';
import { cn } from './utils/cn';

interface ButtonProps extends PressableProps {
  variant: 'primary';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant,
  loading,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        'h-11 rounded-lg',
        'items-center justify-center',
        Boolean(loading || props.disabled) && 'opacity-90',
        variant === 'primary' && 'bg-gray-900 text-gray-50 hover:opacity-90',
        className,
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="text-white font-inter-semibold">{children}</Text>
      )}
    </Pressable>
  );
}
