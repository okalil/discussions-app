import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Toaster } from "../shared/toast";
import { QueryClientProvider } from "./query-client";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <BottomSheetModalProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </BottomSheetModalProvider>
      </KeyboardProvider>
      <Toaster />
    </SafeAreaProvider>
  );
}
