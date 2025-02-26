import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const QuotesScreen = () => {
  const [newQuote, setNewQuote] = useState("");
  const [quotes, setQuotes] = useState<string[]>([]);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const storedQuotes = await AsyncStorage.getItem("customQuotes");
        if (storedQuotes) {
          setQuotes(JSON.parse(storedQuotes));
        }
      } catch (error) {
        console.error("名言の読み込みに失敗しました:", error);
      }
    };
    loadQuotes();
  }, []);

  const addQuote = async () => {
    if (newQuote.trim() !== "") {
      const updatedQuotes = [...quotes, newQuote];
      setQuotes(updatedQuotes);
      setNewQuote("");

      try {
        await AsyncStorage.setItem("customQuotes", JSON.stringify(updatedQuotes));
      } catch (error) {
        console.error("名言の保存に失敗しました:", error);
      }
    }
  };

  const deleteQuote = async (index: number) => {
    const updatedQuotes = quotes.filter((_, i) => i !== index);
    setQuotes(updatedQuotes);

    try {
      await AsyncStorage.setItem("customQuotes", JSON.stringify(updatedQuotes));
    } catch (error) {
      console.error("名言の削除に失敗しました:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>名言リスト</Text>
      <TextInput
        style={styles.input}
        placeholder="新しい名言を入力"
        value={newQuote}
        onChangeText={setNewQuote}
      />
      <Button title="名言を追加" onPress={addQuote} />
      <FlatList
        data={quotes}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  flatList: {
    marginTop: 10,
  },
  quoteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  quoteText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#ff5555",
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});