import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { Header } from "./Header";
import { TimerDisplay } from "./TimerDisplay";
import { TabBar } from "./TabBar";
import { useTimer } from "./useTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FocusApp = () => {
  const { formattedTime, isActive, startTimer, stopTimer } = useTimer();
  const [quote, setQuote] = useState(""); // 表示する名言
  const [customQuotes, setCustomQuotes] = useState<string[]>([]); // ユーザーが追加した名言
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null); // 名言の変更を管理するタイマー

  const defaultQuotes = [
    "心が変われば行動が変わる",
    "人は習慣によってつくられる",
    "小さいことを積み重ねる",
  ];

  // 名言を AsyncStorage から取得し、統合する
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const storedQuotes = await AsyncStorage.getItem("customQuotes");
        console.log("🔍 Stored Quotes from AsyncStorage:", storedQuotes);

        let parsedQuotes: string[] = storedQuotes ? JSON.parse(storedQuotes) : [];
        setCustomQuotes(parsedQuotes);

        const updatedQuotes = [...defaultQuotes, ...parsedQuotes];
        setQuote(updatedQuotes[0]); // 最初の名言をセット
        console.log("🔍 All Quotes (merged):", updatedQuotes);
      } catch (error) {
        console.error("名言の読み込みに失敗:", error);
      }
    };
    loadQuotes();
  }, []);

  // タイマーが動作中なら 10 秒ごとに名言を変更
  useEffect(() => {
    if (!isActive) {
      if (quoteTimerRef.current) {
        clearInterval(quoteTimerRef.current);
        quoteTimerRef.current = null;
        console.log("🛑 Quote Timer Stopped");
      }
      return;
    }

    const allQuotes = [...defaultQuotes, ...customQuotes];

    if (allQuotes.length > 0) {
      setQuote(allQuotes[0]); // タイマー開始時に最初の名言をセット
    }

    console.log("🚀 Quote Interval Started");
    quoteTimerRef.current = setInterval(() => {
      const newQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
      console.log("🔄 Changing Quote to:", newQuote);
      setQuote(newQuote);
    }, 10000);

    return () => {
      if (quoteTimerRef.current) {
        clearInterval(quoteTimerRef.current);
        quoteTimerRef.current = null;
        console.log("🛑 Quote Timer Stopped (Cleanup)");
      }
    };
  }, [isActive, customQuotes]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Header />
        <TimerDisplay
          time={formattedTime}
          isActive={isActive}
          onStart={() => {
            console.log("🎯 Start Timer Pressed");
            startTimer();
          }}
          onStop={() => {
            console.log("🛑 Stop Timer Pressed");
            stopTimer();
          }}
        />
        <Text
          style={{
            fontSize: 18,
            fontStyle: "italic",
            textAlign: "center",
            marginVertical: 20,
            color: "#555",
          }}
        >
          {quote}
        </Text>
      </View>
      <TabBar />
    </SafeAreaView>
  );
};


// import React from "react";
// import { View, SafeAreaView } from "react-native";
// import { Header } from "./Header";
// import { TimerDisplay } from "./TimerDisplay";
// import { TabBar } from "./TabBar";

// export const FocusApp = () => {
//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <View className="flex-1">
//         <Header />
//         <TimerDisplay />
//         <TabBar />
//       </View>
//     </SafeAreaView>
//   );
// };
