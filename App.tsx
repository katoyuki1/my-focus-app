import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  AppState,
  AppStateStatus
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "./components/Header";
import { QuotesScreen } from "./components/QuotesScreen";
import "./global.css";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const Tab = createBottomTabNavigator();

const defaultQuotes = [
  "スマホを閉じてやるべきことに集中しよう！",
  "行動が変われば心が変わる",
  "人は習慣によってつくられる",
  "小さいことを積み重ねる",
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const FocusScreen = () => {
  const [time, setTime] = useState(600); // 10分
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [quote, setQuote] = useState("");
  const [customQuotes, setCustomQuotes] = useState<string[]>([]);
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const appState = useRef(AppState.currentState); //  useEffectの外で定義

// 通知機能の登録
useEffect(() => {
  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("通知の権限が拒否されました");
        return;
      }
    } else {
      console.log("実機でのみ通知が機能します");
    }
  }
  registerForPushNotificationsAsync();
}, []);

useEffect(() => {
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/active/) && nextAppState === "background" && isRunning) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "誘惑に負けてませんか？",
          body: "集中する？",
        },
        trigger: {
          seconds: 1,
          repeats: false,
        },
      });
    }
    appState.current = nextAppState;
  };

  const subscription = AppState.addEventListener("change", handleAppStateChange);

  return () => {
    subscription.remove();
  };
}, [isRunning]);

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

  // useEffect(() => {
  //   let timer: NodeJS.Timeout;
  //   if (isRunning && time > 0) {
  //     timer = setInterval(() => {
  //       setTime((prevTime) => prevTime - 1);
  //     }, 1000);
  //   } else {
  //     setIsRunning(false);
  //   }
  //   return () => clearInterval(timer);
  // }, [isRunning, time]);

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

  // ❶ タイマー終了処理: time が 1秒以下になったら 0 にセットして isRunning を止める
  // useEffect(() => {
  //   let timer: NodeJS.Timeout;
  //   if (isRunning && time > 0) {
  //     timer = setInterval(() => {
  //       setTime((prevTime) => {
  //         if (prevTime <= 1) {
  //           setIsRunning(false);
  //           return 0;
  //         }
  //         return prevTime - 1;
  //       });
  //     }, 1000);
  //   } else {
  //     setIsRunning(false);
  //   }
  //   return () => clearInterval(timer);
  // }, [isRunning, time]);

  // ❷ time が 0 になったらメッセージを表示
  useEffect(() => {
    if (time === 0) {
      setQuote("おめでとうございます🎉あなたは目の前のことに集中できました！");
    }
  }, [time]);

  const openModal = () => {
    setModalVisible(true);
  };

  const applyTimeSetting = () => {
    setTime(selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds);
    setModalVisible(false);
  };

  const startTimer = () => {
    // 現在時刻から、設定された秒数後を終了時刻とする
    setEndTime(Date.now() + time * 1000);
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTime(600);
    setIsRunning(false);
    setEndTime(null);
    setQuote("");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && endTime !== null) {
      timer = setInterval(() => {
        // 残り秒数を算出
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTime(remaining);
        // 残り時間が0になったらタイマー停止
        if (remaining <= 0) {
          setIsRunning(false);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, endTime]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>時間を設定</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedHours.toString()}
                  onValueChange={(v) => setSelectedHours(Number(v))}
                  style={{ width: 120 }}  // ✅ 幅を指定
                >
                  {[...Array(1000).keys()].map((h) => (
                    <Picker.Item key={h} label={`${h}時`} value={h.toString()} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={selectedMinutes.toString()}
                  onValueChange={(v) => setSelectedMinutes(Number(v))}
                  style={{ width: 120 }}  // ✅ 幅を指定
                >
                  {[...Array(60).keys()].map((m) => (
                    <Picker.Item key={m} label={`${m}分`} value={m.toString()} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={selectedSeconds.toString()}
                  onValueChange={(v) => setSelectedSeconds(Number(v))}
                  style={{ width: 120 }}  // ✅ 幅を指定
                >
                  {[...Array(60).keys()].map((s) => (
                    <Picker.Item key={s} label={`${s}秒`} value={s.toString()} />
                  ))}
                </Picker>
              </View>
              <View style={styles.buttonContainer}>
                <Button title="OK" onPress={applyTimeSetting} />
                <Button title="キャンセル" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>

        {/* 名言をタイマーの上に移動 & フォントサイズを調整 */}
        <Text style={styles.quote}>{quote}</Text>
        <Text style={styles.timer}>{formatTime(time)}</Text>
        <TouchableOpacity
          style={[styles.button, isRunning ? styles.buttonStop : styles.buttonStart]}
          onPress={isRunning ? resetTimer : startTimer}
        >
          <Text style={styles.buttonText}>{isRunning ? "ストップ" : "スタート"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={openModal}
        >
          <Text style={styles.settingButtonText}>時間を設定</Text>
        </TouchableOpacity>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",  // ✅ 横に並べる
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 30, // 丸っぽい形
    alignItems: "center",
  },

  buttonStart: {
    backgroundColor: "#3B82F6", // 青色
  },

  buttonStop: {
    backgroundColor: "#EF4444", // 赤色（停止時）
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  settingButton: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 2, // 境界線
    borderColor: "#3B82F6", // スタートボタンと同じ青色
    alignItems: "center",
    marginTop: 10, // スタートボタンとの間隔
  },
  settingButtonText: {
    color: "#3B82F6", // 青色
    fontSize: 18,
    fontWeight: "bold",
  },
});