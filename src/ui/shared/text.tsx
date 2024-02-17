import { Text as NativeText, TextProps } from 'react-native';

export function Text(props: TextProps) {
  return <NativeText className="font-inter-normal" {...props} />;
}
