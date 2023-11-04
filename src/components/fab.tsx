import React from 'react';
import { MotiPressable, MotiPressableProps } from 'moti/interactions';

interface FabProps extends MotiPressableProps {
  icon: JSX.Element;
}

export function Fab({ icon, style, ...props }: FabProps) {
  return (
    <MotiPressable
      {...props}
      style={[
        {
          position: 'absolute',
          bottom: 16,
          right: 16,
          padding: 16,
          borderRadius: 9999,
          backgroundColor: 'black',
        },
        style,
      ]}
      animate={React.useMemo(
        () =>
          ({ pressed }) => {
            'worklet';
            return {
              opacity: pressed ? 0.7 : 1,
            };
          },
        []
      )}
      transition={React.useMemo(
        () =>
          ({ pressed }) => {
            'worklet';
            return {
              delay: pressed ? 0 : 100,
            };
          },
        []
      )}
    >
      {icon}
    </MotiPressable>
  );
}
