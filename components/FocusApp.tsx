import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { Header } from "./Header";
import { TimerDisplay } from "./TimerDisplay";
import { TabBar } from "./TabBar";
import { useTimer } from "./useTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FocusApp = () => {
  const { formattedTime, isActive, startTimer, stopTimer } = useTimer();
  const [quote, setQuote] = useState("");
  const [customQuotes, setCustomQuotes] = useState<string[]>([]);
  const [allQuotes, setAllQuotes] = useState<string[]>([]);
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null); // 🔹 タイマー管理用

  const defaultQuotes = [
    "心が変われば行動が変わる",
    "人は習慣によってつくられる",
    "小さいことを積み重ねる",
  ];

  // 名言の保存データを読み込む
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const storedQuotes = await AsyncStorage.getItem("customQuotes");
        console.log("🔍 Stored Quotes from AsyncStorage:", storedQuotes);

        let parsedQuotes: string[] = [];
        if (storedQuotes) {
          parsedQuotes = JSON.parse(storedQuotes);
        }

        const updatedQuotes = [...defaultQuotes, ...parsedQuotes];
        setCustomQuotes(parsedQuotes);
        setAllQuotes(updatedQuotes);
        console.log("🔍 All Quotes (merged):", updatedQuotes);

        if (updatedQuotes.length > 0) {
          setQuote(updatedQuotes[0]); // 最初の名言を表示
        }
      } catch (error) {
        console.error("名言の読み込みに失敗:", error);
      }
    };
    loadQuotes();
  }, []);

  // 🔹 **名言の変更ロジック**
  useEffect(() => {
    if (!isActive || allQuotes.length === 0) return; // タイマーが動いていなければ何もしない

    console.log("🚀 Timer Started - Showing first quote:", quote);

    // 既存のタイマーをクリア
    if (quoteTimerRef.current) {
      clearInterval(quoteTimerRef.current);
    }

    // 新しいタイマーを開始
    quoteTimerRef.current = setInterval(() => {
      setQuote((prevQuote) => {
        const newQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
        console.log("🔄 Changing Quote to:", newQuote);
        return newQuote;
      });
    }, 10000); // 10秒ごとに更新

    return () => {
      if (quoteTimerRef.current) {
        clearInterval(quoteTimerRef.current);
        console.log("🛑 Quote Timer Stopped");
      }
    };
  }, [isActive]); // `isActive` のみを監視

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
        {/* 🔹 名言を適切に表示する */}
        <Text style={{ fontSize: 18, fontStyle: "italic", textAlign: "center", marginVertical: 20, color: "#555" }}>
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
