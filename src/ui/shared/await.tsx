import React, { Suspense } from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

import { Text } from './text';

interface AwaitProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: (props: FallbackProps) => React.ReactNode;
}

const defaultFallback = (
  <View className="flex-1 items-center justify-center">
    <ActivityIndicator color="black" size="large" />
  </View>
);

const defaultErrorFallback = (props: FallbackProps) => (
  <View className="flex-1 items-center justify-center">
    <Text className="text-base">Houve um erro ao carregar</Text>
    <Pressable onPress={() => props.resetErrorBoundary()}>
      <Text className="underline text-base">Tentar novamente</Text>
    </Pressable>
  </View>
);

export function Await({
  children,
  fallback = defaultFallback,
  errorFallback = defaultErrorFallback,
}: AwaitProps) {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary onReset={reset} fallbackRender={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
