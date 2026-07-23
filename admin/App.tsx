import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ActionSheetProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ActionSheetProvider>
  );
}