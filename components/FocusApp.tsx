import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { Header } from "./Header";
import { TimerDisplay } from "./TimerDisplay";
import { TabBar } from "./TabBar";
import { useTimer } from "./useTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FocusApp = () => {
  // useTimer でタイマーを管理
  const { formattedTime, isActive, startTimer, stopTimer } = useTimer();
  // quoteTimerActive は名言更新用の状態（isActive とは独立）
  const [quoteTimerActive, setQuoteTimerActive] = useState(false);
  const [quote, setQuote] = useState(""); // 表示する名言
  const [customQuotes, setCustomQuotes] = useState<string[]>([]); // ユーザー追加の名言
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null);

  const defaultQuotes = [
    "心が変われば行動が変わる",
    "人は習慣によってつくられる",
    "小さいことを積み重ねる",
  ];

  // 名言の保存データを読み込み、デフォルト名言と統合
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
        console.log("🔍 All Quotes (merged):", updatedQuotes);
        if (updatedQuotes.length > 0) {
          setQuote(updatedQuotes[0]);
        }
      } catch (error) {
        console.error("名言の読み込みに失敗:", error);
      }
    };
    loadQuotes();
  }, []);

  // mergedQuotes をメモ化（依存性管理）
  const mergedQuotes = useMemo(() => [...defaultQuotes, ...customQuotes], [customQuotes]);

  // 名言更新用のタイマーを、quoteTimerActive をトリガーに設定
  useEffect(() => {
    console.log("⚡ useEffect for Quote Timer - quoteTimerActive:", quoteTimerActive, "Merged Quotes Count:", mergedQuotes.length);
    if (!quoteTimerActive || mergedQuotes.length === 0) {
      if (quoteTimerRef.current) {
        clearInterval(quoteTimerRef.current);
        quoteTimerRef.current = null;
        console.log("🛑 Quote Timer Stopped");
      }
      return;
    }
    // 新しいタイマーを開始
    quoteTimerRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mergedQuotes.length);
      const newQuote = mergedQuotes[randomIndex];
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
  }, [quoteTimerActive, mergedQuotes]);

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
            setQuoteTimerActive(true); // タイマー開始時に名言更新も開始
          }}
          onStop={() => {
            console.log("🛑 Stop Timer Pressed");
            stopTimer();
            setQuoteTimerActive(false); // タイマー停止時に名言更新も停止
          }}
        />
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
