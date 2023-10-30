import { Image, View, Text } from 'react-native';
import { url } from '~/data/network/api';
import { cn } from '~/utils/classnames';

interface Props {
  src?: string;
  alt: string;
}

export function Avatar({ src, alt }: Props) {
  return src ? (
    <Image
      className="h-10 w-10 rounded-full"
      source={{
        uri: url + src,
      }}
    />
  ) : (
    <View
      className={cn(
        'h-10 w-10 items-center justify-center',
        'border border-gray-300 rounded-full'
      )}
    >
      <Text>{alt.at(0)}</Text>
    </View>
  );
}
