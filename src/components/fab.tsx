import { Pressable, PressableProps } from 'react-native';

interface FabProps extends PressableProps {
  icon: JSX.Element;
}

export function Fab({ icon, ...props }: FabProps) {
  return (
    <Pressable
      className="absolute bottom-4 right-4 px-4 py-4 rounded-full bg-black"
      {...props}
    >
      {icon}
    </Pressable>
  );
}
