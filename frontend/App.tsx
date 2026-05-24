/**
 * App entry point — wires the navigator tree together.
 */
import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabsStack from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <TabsStack />
    </GestureHandlerRootView>
  );
}
