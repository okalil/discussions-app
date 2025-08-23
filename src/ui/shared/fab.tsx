import React from 'react';
import type { TouchableOpacityProps } from 'react-native';
import { TouchableOpacity, View } from 'react-native';

interface FabProps extends TouchableOpacityProps {
  icon: React.JSX.Element;
}

export function Fab({ icon, style, ...props }: FabProps) {
  return (
    <View className="absolute bottom-4 right-4">
      <TouchableOpacity
        {...props}
        style={[
          {
            padding: 16,
            borderRadius: 9999,
            backgroundColor: 'black',
          },
          style,
        ]}
        activeOpacity={0.7}
      >
        {icon}
      </TouchableOpacity>
    </View>
  );
}
