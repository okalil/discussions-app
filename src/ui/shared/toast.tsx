import { useEffect, useRef } from 'react';
import { Animated, View, Text, Image } from 'react-native';
import Constants from 'expo-constants';

import toast, { useToaster, Toast as T } from 'react-hot-toast/headless';

interface ToastProps {
  toast: T;
  onHeight: (height: number) => void;
  offset: number;
}

export class Toast {
  static show(message: string, duration: number) {
    toast(message, {
      duration,
      icon: (
        <Image
          key="teste"
          source={require('~/../assets/icon.png')}
          className="w-5 h-5 rounded-lg"
        />
      ),
    });
  }
  static SHORT = 2000;
  static LONG = 5000;
}

function ToastView({ toast: t, onHeight, offset }: ToastProps) {
  // Animations for enter and exit
  const fadeAnim = useRef(new Animated.Value(0.5)).current;
  const posAnim = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: t.visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, t.visible]);

  useEffect(() => {
    Animated.spring(posAnim, {
      toValue: t.visible ? offset : -80,
      useNativeDriver: true,
    }).start();
  }, [posAnim, offset, t.visible]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: t.visible ? 9999 : undefined,
        alignItems: 'center',
        opacity: fadeAnim,
        transform: [{ translateY: posAnim }],
      }}
    >
      <View
        onLayout={event => onHeight(event.nativeEvent.layout.height)}
        className="px-5 py-3"
        style={{
          margin: Constants.statusBarHeight + 10,
          backgroundColor: '#404040',
          borderRadius: 22,
        }}
        key={t.id}
      >
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <View>{t.icon}</View>
          <Text
            className="text-white text-base leading-5"
            style={{ flexShrink: 1 }}
            numberOfLines={4}
          >
            {typeof t.message === 'function' ? t.message(t) : t.message}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export function Toaster() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {toasts.map(t => (
        <ToastView
          key={t.id}
          toast={t}
          onHeight={height => handlers.updateHeight(t.id, height)}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
        />
      ))}
    </View>
  );
}
