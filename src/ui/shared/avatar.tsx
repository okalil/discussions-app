import { Image, View } from 'react-native';
import { url } from '~/data/core/network/api';
import { cn } from '~/ui/shared/utils/cn';
import { Text } from '~/ui/shared/text';

interface Props {
  src?: string;
  alt: string;
  size?: number;
}

export function Avatar({ src, alt, size = 40 }: Props) {
  return src ? (
    <Image
      className="rounded-full"
      style={{ width: size, height: size }}
      source={{
        uri: src.startsWith('/') ? url + src : src,
      }}
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
