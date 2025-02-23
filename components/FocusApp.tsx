import React from "react";
import { View, SafeAreaView } from "react-native";
import { Header } from "./Header";
import { TimerDisplay } from "./TimerDisplay";
import { TabBar } from "./TabBar";

export const FocusApp = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <Header />
        <TimerDisplay />
        <TabBar />
      </View>
    </SafeAreaView>
  );
};
