import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function App() {
  const [time, setTime] = useState(60); // タイマーの初期値（秒）
  const [isRunning, setIsRunning] = useState(false);
  const [quote, setQuote] = useState(""); // 現在の名言
  const [newQuote, setNewQuote] = useState(""); // ユーザー入力の名言
  const [customQuotes, setCustomQuotes] = useState<string[]>([]); // ユーザー追加の名言リスト

  // デフォルトの名言リスト
  const defaultQuotes = [
    "成功とは、準備ができた人に訪れるチャンスのことだ。",
    // "夢を追う勇気を持てば、どんな困難も乗り越えられる。",
    // "小さな努力が、大きな成果につながる。",
    // "今日できることを明日に延ばすな。",
    // "自分を信じて、一歩踏み出そう。"
  ];

  // タイマーの処理（1秒ごとに減らす）
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  // 10秒ごとに名言を変更する処理
  useEffect(() => {
    let quoteTimer: NodeJS.Timeout;
    if (isRunning) {
      setQuote(defaultQuotes[0]); // 最初の名言をセット
      quoteTimer = setInterval(() => {
        const allQuotes = [...defaultQuotes, ...customQuotes]; // 追加された名言も含める
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        setQuote(allQuotes[randomIndex]);
      }, 10000);
    }
    return () => clearInterval(quoteTimer);
  }, [isRunning, customQuotes]); // `customQuotes` が変わったら新しい名言リストで選択

  // タイマー開始
  const startTimer = () => {
    setIsRunning(true);
  };

  // タイマーリセット
  const resetTimer = () => {
    setTime(60);
    setIsRunning(false);
    setQuote(""); // 名言をリセット
  };

  // 名言を追加する処理
  const addQuote = () => {
    if (newQuote.trim() !== "") {
      setCustomQuotes([...customQuotes, newQuote]); // リストに追加
      setNewQuote(""); // 入力欄をクリア
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{time}秒</Text>
      <Text style={styles.quote}>{quote}</Text>
      <Button title="スタート" onPress={startTimer} disabled={isRunning} />
      <Button title="リセット" onPress={resetTimer} />

      {/* 名言の追加エリア */}
      <TextInput
        style={styles.input}
        placeholder="新しい名言を入力"
        value={newQuote}
        onChangeText={setNewQuote}
      />
      <Button title="名言を追加" onPress={addQuote} />
    </View>
  );
}

// スタイルの設定
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

// 2025-02-03
// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// export default function App() {
//   const [time, setTime] = useState(60); // タイマーの初期値（秒）
//   const [isRunning, setIsRunning] = useState(false);
//   const [quote, setQuote] = useState(""); // 現在の名言

//   // 名言リスト
//   const quotes = [
//     "成功とは、準備ができた人に訪れるチャンスのことだ。",
//     "夢を追う勇気を持てば、どんな困難も乗り越えられる。",
//     "小さな努力が、大きな成果につながる。",
//     "今日できることを明日に延ばすな。",
//     "自分を信じて、一歩踏み出そう。"
//   ];

//   // タイマーの処理（1秒ごとに減らす）
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (isRunning && time > 0) {
//       timer = setInterval(() => {
//         setTime((prevTime) => prevTime - 1);
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isRunning, time]);

//   // 10秒ごとに名言を変更する処理（独立した `useEffect`）
//   useEffect(() => {
//     let quoteTimer: NodeJS.Timeout;
//     if (isRunning) {
//       setQuote(quotes[0]); // タイマー開始時に最初の名言をセット
//       quoteTimer = setInterval(() => {
//         const randomIndex = Math.floor(Math.random() * quotes.length);
//         setQuote(quotes[randomIndex]);
//       }, 10000); // 10秒ごとにランダムな名言を設定
//     }

//     return () => clearInterval(quoteTimer);
//   }, [isRunning]); // `isRunning` が変わった時のみ実行

//   const startTimer = () => {
//     setIsRunning(true);
//   };

//   const resetTimer = () => {
//     setTime(60);
//     setIsRunning(false);
//     setQuote(""); // 名言をリセット
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.timer}>{time}秒</Text>
//       <Text style={styles.quote}>{quote}</Text>
//       <Button title="スタート" onPress={startTimer} disabled={isRunning} />
//       <Button title="リセット" onPress={resetTimer} />
//     </View>
//   );
// }

// // スタイルの設定
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 20,
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
// });

// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// export default function App() {
//   const [time, setTime] = useState(60); // タイマーの初期値（秒）
//   const [isRunning, setIsRunning] = useState(false);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (isRunning && time > 0) {
//       timer = setInterval(() => {
//         setTime((prevTime) => prevTime - 1);
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isRunning, time]);

//   const startTimer = () => setIsRunning(true);
//   const resetTimer = () => {
//     setTime(60);
//     setIsRunning(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.timer}>{time}秒</Text>
//       <Button title="スタート" onPress={startTimer} disabled={isRunning} />
//       <Button title="リセット" onPress={resetTimer} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   timer: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });