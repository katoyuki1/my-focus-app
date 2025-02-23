import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { styled } from "nativewind";
import { Header } from "./Header";
import { TimerDisplay } from "./TimerDisplay";
import { TabBar } from "./TabBar";
import { useTimer } from "./useTimer";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);

export const FocusApp = () => {
  const [currentTab, setCurrentTab] = useState("home");
  const { formattedTime, isActive, startTimer, stopTimer } = useTimer();

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <Header />
      <StyledView className="flex-1">
        <TimerDisplay
          time={formattedTime}
          isActive={isActive}
          onStart={startTimer}
          onStop={stopTimer}
        />
      </StyledView>
      <TabBar currentTab={currentTab} onTabPress={setCurrentTab} />
    </StyledSafeAreaView>
  );
};
