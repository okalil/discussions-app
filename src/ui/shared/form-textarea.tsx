import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { TextInput, View, TextInputProps, Pressable } from 'react-native';

import { Text } from './text';
import { cn } from './utils';

interface FormTextareaProps extends TextInputProps {
  name: string;
  rules?: Parameters<typeof useController>[0]['rules'];
  label?: string;
}

export function FormTextarea({
  name,
  label,
  className,
  style,
  rules,
  ...props
}: FormTextareaProps) {
  const form = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ control: form.control, name, rules });

  return (
    <Pressable
      onPress={() => form.setFocus(name)}
      className={cn('flex-col relative gap-y-2')}
      style={style}
    >
      <Text className="font-inter-semibold">{label}</Text>

      <View>
        <TextInput
          {...props}
          ref={field.ref}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={{ minHeight: 200 }}
          className={cn(
            'bg-gray-50 rounded px-4 py-4',
            'border border-gray-300',
            'focus:border-2 focus:border-gray-800',
            error && 'border-2 border-red-500'
          )}
        />
      </View>
      {error && <Text className="text-red-600">{error.message}</Text>}
    </Pressable>
  );
}
