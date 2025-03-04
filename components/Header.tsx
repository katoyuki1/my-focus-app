import React from "react";
import { View, Text, StatusBar } from "react-native";

export const Header = () => {
  return (
    <View className="bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="h-14 justify-center items-center border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-800">
          Simple Focus
        </Text>
      </View>
    </View>
  );
};
