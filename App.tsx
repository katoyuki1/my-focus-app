import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "./global.css"
import { Header } from "./components/Header";

export default function App() {
  const [time, setTime] = useState(1800);
  const [isRunning, setIsRunning] = useState(false);
  const [quote, setQuote] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [customQuotes, setCustomQuotes] = useState<string[]>([]);

  const defaultQuotes = [
    "心が変われば行動が変わる、行動が変われば習慣が変わる、習慣が変われば人格が変わる、人格が変われば運命が変わる",
    "人は習慣によってつくられる。優れた結果は一時的な行動ではなく、習慣から生まれる",
    "小さいことを積み重ねるのが、とんでもないところへ行くただ１つの道だ",
    "はじめは人が習慣を作り、それから習慣が人を作る"
  ];

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
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  useEffect(() => {
    let quoteTimer: NodeJS.Timeout;
    if (isRunning) {
      setQuote(defaultQuotes[0]);
      quoteTimer = setInterval(() => {
        const allQuotes = [...defaultQuotes, ...customQuotes];
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        setQuote(allQuotes[randomIndex]);
      }, 10000);
    }
    return () => clearInterval(quoteTimer);
  }, [isRunning, customQuotes]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTime(60);
    setIsRunning(false);
    setQuote("");
  };

  const addQuote = async () => {
    if (newQuote.trim() !== "") {
      const updatedQuotes = [...customQuotes, newQuote];
      setCustomQuotes(updatedQuotes);
      setNewQuote("");

      try {
        await AsyncStorage.setItem("customQuotes", JSON.stringify(updatedQuotes));
      } catch (error) {
        console.error("名言の保存に失敗しました:", error);
      }
    }
  };

  const deleteQuote = async (index: number) => {
    const updatedQuotes = customQuotes.filter((_, i) => i !== index);
    setCustomQuotes(updatedQuotes);

    try {
      await AsyncStorage.setItem("customQuotes", JSON.stringify(updatedQuotes));
    } catch (error) {
      console.error("名言の削除に失敗しました:", error);
    }
  };

  return (
    <SafeAreaView
     style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.timer}>{time}秒</Text>
        <Text style={styles.quote}>{quote}</Text>
        <Button title="スタート" onPress={startTimer} disabled={isRunning} />
        <Button title="リセット" onPress={resetTimer} />

        <TextInput
          style={styles.input}
          placeholder="新しい名言を入力"
          value={newQuote}
          onChangeText={setNewQuote}
        />
        <Button title="名言を追加" onPress={addQuote} />

        {/* FlatList が画面全体をスクロール可能にする */}
        <FlatList
          data={customQuotes}
          keyExtractor={(item, index) => index.toString()}
          style={styles.flatList}
          renderItem={({ item, index }) => (
            <View style={styles.quoteItem}>
              <Text style={styles.quoteText}>{item}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteQuote(index)}>
                <Text style={styles.deleteButtonText}>削除</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
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
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  flatList: {
    width: '100%',
    marginTop: 10,
  },
  quoteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quoteText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff5555',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});