import type { TextProps } from 'react-native';
import { Text as NativeText } from 'react-native';

export function Text(props: TextProps) {
  return <NativeText className="font-inter-normal" {...props} />;
}
