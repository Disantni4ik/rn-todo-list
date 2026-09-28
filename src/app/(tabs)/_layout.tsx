import { useTheme } from '@/context/ThemeContext';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from "expo-router";

export default function TabsLayout() {
	const { colors } = useTheme()

	return (
		<Tabs screenOptions={{
			headerShown: false,
			tabBarActiveTintColor: colors.primary,
			tabBarInactiveTintColor: colors.textMuted,
			tabBarStyle: {
				backgroundColor: colors.surface,
				borderColor: colors.border
			}
		}}>
			<Tabs.Screen 
				name="index"
				options={{
					title: 'Завдання',
					tabBarIcon: ({color, size}) => (
						<FontAwesome5 name="tasks" size={size} color={color} />
					)
				}}
			/>
			<Tabs.Screen 
				name="stats"
				options={{
					title: 'Статистика',
					tabBarIcon: ({color, size}) => (
						<Entypo name="bar-graph" size={size} color={color} />
					)
				}}
			/>
			<Tabs.Screen 
				name="settings"
				options={{
					title: 'Налаштування',
					tabBarIcon: ({color, size}) => (
						<Feather name="settings" size={size} color={color} />
					)
				}}
			/>
		</Tabs>
	)
}