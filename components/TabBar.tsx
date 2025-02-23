import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface TabBarProps {
  currentTab: string;
  onTabPress: (tab: string) => void;
}

export const TabBar = ({ currentTab, onTabPress }: TabBarProps) => {
  return (
    <StyledView className="border-t border-gray-200 bg-white">
      <StyledView className="flex-row justify-around items-center py-2">
        <StyledTouchableOpacity
          className="items-center"
          onPress={() => onTabPress("home")}
        >
          <Ionicons
            name="home"
            size={24}
            color={currentTab === "home" ? "#3B82F6" : "#6B7280"}
          />
          <StyledText
            className={`text-sm mt-1 ${
              currentTab === "home" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Home
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          className="items-center"
          onPress={() => onTabPress("quotes")}
        >
          <Ionicons
            name="quote"
            size={24}
            color={currentTab === "quotes" ? "#3B82F6" : "#6B7280"}
          />
          <StyledText
            className={`text-sm mt-1 ${
              currentTab === "quotes" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Quotes
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          className="items-center"
          onPress={() => onTabPress("settings")}
        >
          <Ionicons
            name="settings"
            size={24}
            color={currentTab === "settings" ? "#3B82F6" : "#6B7280"}
          />
          <StyledText
            className={`text-sm mt-1 ${
              currentTab === "settings" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Settings
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};
