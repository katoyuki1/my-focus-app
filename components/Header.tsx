import React from "react";
import { View, Text, StatusBar } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export const Header = () => {
  return (
    <StyledView className="bg-white">
      <StatusBar barStyle="dark-content" />
      <StyledView className="pt-12 pb-4 px-4 border-b border-gray-200">
        <StyledText className="text-xl font-semibold text-center text-gray-800">
          My Focus App
        </StyledText>
      </StyledView>
    </StyledView>
  );
};
