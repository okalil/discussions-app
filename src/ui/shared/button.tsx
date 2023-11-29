import {
  Text,
  Pressable,
  PressableProps,
  ActivityIndicator,
} from 'react-native';
import { cn } from '~/ui/shared/utils';

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
        'h-10 rounded',
        'items-center justify-center',
        Boolean(loading || props.disabled) && 'opacity-90',
        variant === 'primary' && 'bg-gray-900 text-gray-50 hover:opacity-90',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="text-white font-semibold">{children}</Text>
      )}
    </Pressable>
  );
}
