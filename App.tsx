import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "./components/Header";
import { QuotesScreen } from "./components/QuotesScreen";
import "./global.css";

const Tab = createBottomTabNavigator();

const defaultQuotes = [
  "心が変われば行動が変わる",
  "人は習慣によってつくられる",
  "小さいことを積み重ねる",
];

const FocusScreen = () => {
  const [time, setTime] = useState(1800);
  const [isRunning, setIsRunning] = useState(false);
  const [quote, setQuote] = useState("");
  const [customQuotes, setCustomQuotes] = useState<string[]>([]);
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // **時間を HHH:MM:SS の形式にフォーマット**
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(3, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const storedQuotes = await AsyncStorage.getItem("customQuotes");
        if (storedQuotes) {
          setCustomQuotes(JSON.parse(storedQuotes));
        }
      } catch (error) {
        console.error("名言の読み込みに失敗しました:", error);
      }
    };
    loadQuotes();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  useEffect(() => {
    if (!isRunning) {
      if (quoteTimerRef.current) {
        clearInterval(quoteTimerRef.current);
        quoteTimerRef.current = null;
      }
      return;
    }

    const allQuotes = [...defaultQuotes, ...customQuotes];

    if (allQuotes.length > 0) {
      setQuote(allQuotes[0]); // タイマー開始時に最初の名言をセット
    }

    quoteTimerRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * allQuotes.length);
      setQuote(allQuotes[randomIndex]);
    }, 10000);

    return () => {
      if (quoteTimerRef.current) {
        clearInterval(quoteTimerRef.current);
        quoteTimerRef.current = null;
      }
    };
  }, [isRunning, customQuotes]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTime(1800);
    setIsRunning(false);
    setQuote("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        {/* 名言をタイマーの上に移動 & フォントサイズを調整 */}
        <Text style={styles.quote}>{quote}</Text>
        <Text style={styles.timer}>{formatTime(time)}</Text>
        <Button title="スタート" onPress={startTimer} disabled={isRunning} />
        <Button title="リセット" onPress={resetTimer} />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            let iconSource;
            if (route.name === "Home") {
              iconSource = require("./assets/home-icon.png");
            } else if (route.name === "Quotes") {
              iconSource = require("./assets/quotes-icon.png");
            }
            return <Image source={iconSource} style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }} />;
          },
          tabBarLabelStyle: { fontSize: 12 },
        })}
      >
        <Tab.Screen name="Home" component={FocusScreen} />
        <Tab.Screen name="Quotes" component={QuotesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  quote: {
    fontSize: 48, // タイマーと同じフォントサイズ
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  tabBarContainer: {
    height: 80, // ナビゲーションの高さを確保
    justifyContent: "flex-end",
  },
});


// React は コンポーネント（画面）を作成するためのライブラリ.React を import しないと React Native のコンポーネントを作れない
// 役割: アプリ全体のナビゲーション（画面遷移）を管理
// createBottomTabNavigatorを使うと、アプリの下にタブメニューを表示できる
// FocusApp.tsx で作った UI を、App.tsx で使うために import している.コンポーネント とは？ → 画面の部品（UIのパーツ）
// React Native では通常 CSS は使わないが、nativewind などのツールを使う場合は global.css を読み込むこともある
// import React from "react"; 
// import { NavigationContainer } from "@react-navigation/native"; 
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
// import { FocusApp } from "./components/FocusApp"; 
// import { QuotesScreen } from "./components/QuotesScreen";
// import "./global.css" 

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={FocusApp} options={{ headerShown: false }} />
//         <Tab.Screen name="Quotes" component={QuotesScreen} options={{ headerShown: false }} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import "./global.css"
// import { Header } from "./components/Header";

// export default function App() {
//   const [time, setTime] = useState(1800);
//   const [isRunning, setIsRunning] = useState(false);
//   const [quote, setQuote] = useState("");
//   const [newQuote, setNewQuote] = useState("");
//   const [customQuotes, setCustomQuotes] = useState<string[]>([]);

//   const defaultQuotes = [
//     "心が変われば行動が変わる、行動が変われば習慣が変わる、習慣が変われば人格が変わる、人格が変われば運命が変わる",
//     "人は習慣によってつくられる。優れた結果は一時的な行動ではなく、習慣から生まれる",
//     "小さいことを積み重ねるのが、とんでもないところへ行くただ１つの道だ",
//     "はじめは人が習慣を作り、それから習慣が人を作る"
//   ];

//   useEffect(() => {
//     const loadQuotes = async () => {
//       try {
//         const storedQuotes = await AsyncStorage.getItem("customQuotes");
//         if (storedQuotes) {
//           setCustomQuotes(JSON.parse(storedQuotes));
//         }
//       } catch (error) {
//         console.error("名言の読み込みに失敗しました:", error);
//       }
//     };
//     loadQuotes();
//   }, []);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (isRunning && time > 0) {
//       timer = setInterval(() => {
//         setTime((prevTime) => prevTime - 1);
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isRunning, time]);

//   useEffect(() => {
//     let quoteTimer: NodeJS.Timeout;
//     if (isRunning) {
//       setQuote(defaultQuotes[0]);
//       quoteTimer = setInterval(() => {
//         const allQuotes = [...defaultQuotes, ...customQuotes];
//         const randomIndex = Math.floor(Math.random() * allQuotes.length);
//         setQuote(allQuotes[randomIndex]);
//       }, 10000);
//     }
//     return () => clearInterval(quoteTimer);
//   }, [isRunning, customQuotes]);

//   const startTimer = () => {
//     setIsRunning(true);
//   };

//   const resetTimer = () => {
//     setTime(60);
//     setIsRunning(false);
//     setQuote("");
//   };

//   const addQuote = async () => {
//     if (newQuote.trim() !== "") {
//       const updatedQuotes = [...customQuotes, newQuote];
//       setCustomQuotes(updatedQuotes);
//       setNewQuote("");

//       try {
//         await AsyncStorage.setItem("customQuotes", JSON.stringify(updatedQuotes));
//       } catch (error) {
//         console.error("名言の保存に失敗しました:", error);
//       }
//     }
//   };

//   const deleteQuote = async (index: number) => {
//     const updatedQuotes = customQuotes.filter((_, i) => i !== index);
//     setCustomQuotes(updatedQuotes);

//     try {
//       await AsyncStorage.setItem("customQuotes", JSON.stringify(updatedQuotes));
//     } catch (error) {
//       console.error("名言の削除に失敗しました:", error);
//     }
//   };

//   return (
//     <SafeAreaView
//      style={styles.safeArea}>
//       <Header />
//       <View style={styles.container}>
//         <Text style={styles.timer}>{time}秒</Text>
//         <Text style={styles.quote}>{quote}</Text>
//         <Button title="スタート" onPress={startTimer} disabled={isRunning} />
//         <Button title="リセット" onPress={resetTimer} />

//         <TextInput
//           style={styles.input}
//           placeholder="新しい名言を入力"
//           value={newQuote}
//           onChangeText={setNewQuote}
//         />
//         <Button title="名言を追加" onPress={addQuote} />

//         {/* FlatList が画面全体をスクロール可能にする */}
//         <FlatList
//           data={customQuotes}
//           keyExtractor={(item, index) => index.toString()}
//           style={styles.flatList}
//           renderItem={({ item, index }) => (
//             <View style={styles.quoteItem}>
//               <Text style={styles.quoteText}>{item}</Text>
//               <TouchableOpacity style={styles.deleteButton} onPress={() => deleteQuote(index)}>
//                 <Text style={styles.deleteButtonText}>削除</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   timer: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   quote: {
//     fontSize: 18,
//     fontStyle: 'italic',
//     textAlign: 'center',
//     marginVertical: 20,
//     color: '#555',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     width: '100%',
//     marginVertical: 10,
//     backgroundColor: 'white',
//     borderRadius: 5,
//   },
//   flatList: {
//     width: '100%',
//     marginTop: 10,
//   },
//   quoteItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: 'white',
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   quoteText: {
//     fontSize: 16,
//     flex: 1,
//     marginRight: 10,
//   },
//   deleteButton: {
//     backgroundColor: '#ff5555',
//     padding: 8,
//     borderRadius: 5,
//   },
//   deleteButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });