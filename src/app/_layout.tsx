import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootNavigation() {
	const { colors, isDarkMode } = useTheme()

	return (
		<>
			<StatusBar style={isDarkMode ? 'light' : 'dark'}/>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			/>
		</>
	)
}

export default function RootLayout() {
	return (
		<>
			<SafeAreaProvider>
				<ThemeProvider>
					<RootNavigation/>
				</ThemeProvider>
			</SafeAreaProvider>
		</>
	);
}