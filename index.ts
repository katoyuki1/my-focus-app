import { registerRootComponent } from 'expo';
import App from './App';
import firebase from '@react-native-firebase/app';

// Firebaseの初期化
if (!firebase.apps.length) {
  const firebaseConfig = {
    // GoogleService-Info.plistの設定は自動的に読み込まれます
    // iOSのみの場合は空のオブジェクトで問題ありません
  };
  firebase.initializeApp(firebaseConfig);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
