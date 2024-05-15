import React from 'react';
import type { TextInputProps} from 'react-native';
import { TextInput, View, Pressable } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useController, useFormContext } from 'react-hook-form';

import { Text } from './text';
import { cn } from './utils/cn';

interface FormInputProps extends TextInputProps {
  name: string;
  nextFocusDown?: string;
  rules?: Parameters<typeof useController>[0]['rules'];

  label?: string;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
}

export function FormInput({
  name,
  label,
  nextFocusDown,
  className,
  style,
  rules,
  iconLeft,
  iconRight,
  ...props
}: FormInputProps) {
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

      <View className="relative">
        <TextInput
          {...props}
          ref={field.ref}
          value={field.value}
          onChangeText={text => {
            field.onChange(text);
          }}
          onBlur={field.onBlur}
          returnKeyType={nextFocusDown ? 'next' : props.returnKeyType}
          onSubmitEditing={e => {
            if (nextFocusDown) form.setFocus(nextFocusDown);
            props.onSubmitEditing?.(e);
          }}
          className={cn(
            'bg-gray-50 rounded h-12 px-4',
            'border border-gray-300',
            'focus:border-2 focus:border-gray-800',
            error && 'border-2 border-red-500',
            iconLeft && 'pl-12',
            iconRight && 'pr-12'
          )}
        />

        {iconLeft ? (
          <View
            className="absolute left-4 top-1/2"
            style={{ transform: [{ translateY: -12 }] }}
          >
            {iconLeft}
          </View>
        ) : null}
        {iconRight ? (
          <View
            className="absolute right-4 top-1/2"
            style={{ transform: [{ translateY: -12 }] }}
          >
            {iconRight}
          </View>
        ) : null}
      </View>
      {error && <Text className="text-red-600">{error.message}</Text>}
    </Pressable>
  );
}

FormInput.Email = function FormInputEmail(props: FormInputProps) {
  return (
    <FormInput
      {...props}
      iconLeft={<Icon name="account" size={20} />}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  );
};

FormInput.Password = function FormInputPassword(props: FormInputProps) {
  const [visible, toggleVisible] = React.useReducer(state => !state, false);

  return (
    <FormInput
      {...props}
      iconLeft={<Icon name="lock" size={20} />}
      iconRight={
        <Pressable onPress={() => toggleVisible()}>
          <Icon name={visible ? 'eye-off' : 'eye'} size={20} />
        </Pressable>
      }
      secureTextEntry={!visible}
      autoCapitalize="none"
    />
  );
};
