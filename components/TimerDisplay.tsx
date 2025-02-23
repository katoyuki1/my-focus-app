import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface TimerDisplayProps {
  time: string;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const TimerDisplay = ({
  time,
  isActive,
  onStart,
  onStop,
}: TimerDisplayProps) => {
  return (
    <StyledView className="flex-1 justify-center items-center">
      <StyledText className="text-6xl font-bold mb-8 text-gray-800">
        {time}
      </StyledText>
      <StyledTouchableOpacity
        className="bg-blue-500 px-8 py-4 rounded-full"
        onPress={isActive ? onStop : onStart}
      >
        <StyledText className="text-white text-lg font-semibold">
          {isActive ? "Stop Timer" : "Start Timer"}
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};
