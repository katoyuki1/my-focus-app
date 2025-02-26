import React, { useState, useEffect } from "react";
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
        console.log("Stored Quotes:", storedQuotes); // 🔍 デバッグ
        if (storedQuotes) {
          setCustomQuotes(JSON.parse(storedQuotes));
        }
      } catch (error) {
        console.error("名言の読み込みに失敗:", error);
      }
    };
    loadQuotes();
  }, []);

  // タイマーが動作している間、10秒ごとに名言を変更
  useEffect(() => {
    let quoteTimer: NodeJS.Timeout;
    if (isActive) {
      setQuote(defaultQuotes[0]); // 🔹 タイマー開始時にデフォルトの名言を表示

      quoteTimer = setInterval(() => {
        const allQuotes = [...defaultQuotes, ...customQuotes];
        if (allQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * allQuotes.length);
          setQuote(allQuotes[randomIndex]);
        }
      }, 10000);
    }
    return () => clearInterval(quoteTimer);
  }, [isActive, customQuotes]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Header />
        {/* タイマーの表示 */}
        <TimerDisplay
          time={formattedTime}
          isActive={isActive}
          onStart={startTimer}
          onStop={stopTimer}
        />
        {/* 🔹 名言を適切に表示する */}
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
      {/* タブバー */}
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
