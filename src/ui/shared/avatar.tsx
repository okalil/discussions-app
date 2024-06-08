import { Image, ImageProps, View } from 'react-native';
import { url } from '~/data/core/network/api';
import { Text } from '~/ui/shared/text';
import { cn } from '~/ui/shared/utils/cn';

interface Props extends ImageProps {
  src?: string;
  alt: string;
  size?: number;
}

export function Avatar({ src, alt, size = 40, ...props }: Props) {
  return src ? (
    <Image
      className="rounded-full"
      style={{ width: size, height: size }}
      source={{
        uri: src.startsWith('/') ? url + src : src,
      }}
      {...props}
    />
  ) : (
    <View
      className={cn(
        'items-center justify-center',
        'border border-gray-300 rounded-full'
      )}
      style={{ width: size, height: size }}
    >
      <Text>{alt.at(0)}</Text>
    </View>
  );
}
