import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="index"
            options={{ headerShown: false, name: "index", title: "Home" }}
          />
          <Stack.Screen name="todos/[id]" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
