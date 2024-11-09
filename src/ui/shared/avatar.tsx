import type { ImageProps } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';
import { url } from '~/data/core/network/api';
import { Text } from '~/ui/shared/text';
import { cn } from '~/ui/shared/utils/cn';

interface Props extends ImageProps {
  src?: string;
  alt: string;
  size?: number;
}

export function Avatar({ src, alt, size = 40, ...props }: Props) {
  const style = {
    width: size,
    height: size,
    borderWidth: StyleSheet.hairlineWidth,
  };
  return src ? (
    <Image
      className="rounded-full border-gray-300 "
      style={style}
      source={{
        uri: src.startsWith('/') ? url + src : src,
      }}
      {...props}
    />
  ) : (
    <View
      className={cn(
        'items-center justify-center',
        'border-gray-300 rounded-full',
      )}
      style={style}
    >
      <Text className="font-inter-medium" style={{ fontSize: size * 0.375 }}>
        {alt.at(0)}
      </Text>
    </View>
  );
}
