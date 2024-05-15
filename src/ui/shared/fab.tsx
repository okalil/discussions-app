import React from 'react';
import { View } from 'react-native';
import type { MotiPressableProps } from 'moti/interactions';
import { MotiPressable } from 'moti/interactions';

interface FabProps extends MotiPressableProps {
  icon: JSX.Element;
}

export function Fab({ icon, style, ...props }: FabProps) {
  return (
    <View className="absolute bottom-4 right-4">
      <MotiPressable
        {...props}
        style={[
          {
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
    </View>
  );
}
