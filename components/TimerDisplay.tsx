import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTimer } from "./useTimer";

export const TimerDisplay = () => {
  const { formattedTime, isActive, startTimer, stopTimer } = useTimer();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-6xl font-bold mb-8 text-gray-800">
        {formattedTime}
      </Text>
      <TouchableOpacity
        onPress={isActive ? stopTimer : startTimer}
        className="bg-blue-500 px-8 py-4 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">
          {isActive ? "Stop Timer" : "Start Timer"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
