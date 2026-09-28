import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { ThemeColors, useTheme } from "@/context/ThemeContext";
import {
	addTodo,
	deleteTodo,
	getTodos,
	toggleTodo,
	updateTodoText,
} from "@/services/api";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Todo } from "../../types";

export default function Index() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {colors} = useTheme()
	const styles = CreateStyles(colors)

	const fetchTodos = async (isRefresh = false) => {
		try {
			if (isRefresh) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}
			setError(null);
			const data = await getTodos();
			setTodos(data);
		} catch (err) {
			setError(
				"Не вдалося з'єднатися з сервером. Переконайтеся, що json-server запущено (порт 3000).",
			);
			console.error(err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	const handleAdd = async (text: string) => {
		try {
			const newTodo = await addTodo(text);
			setTodos((prev) => [...prev, newTodo]);
		} catch (err) {
			Alert.alert("Помилка", "Не вдалося створити завдання.");
			console.error(err);
		}
	};

	const handleToggle = async (id: string, completed: boolean) => {
		try {
			setTodos((prev) =>
				prev.map((t) => (t.id === id ? { ...t, completed } : t)),
			);
			await toggleTodo(id, completed);
		} catch (err) {
			setTodos((prev) =>
				prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)),
			);
			Alert.alert("Помилка", "Не вдалося оновити статус завдання.");
			console.error(err);
		}
	};

	const handleEdit = async (id: string, text: string) => {
		try {
			setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
			await updateTodoText(id, text);
		} catch (err) {
			fetchTodos();
			Alert.alert("Помилка", "Не вдалося оновити текст завдання.");
			console.error(err);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			setTodos((prev) => prev.filter((t) => t.id !== id));
			await deleteTodo(id);
		} catch (err) {
			fetchTodos();
			Alert.alert("Помилка", "Не вдалося видалити завдання.");
			console.error(err);
		}
	};

	const completedCount = useMemo(
		() => todos.filter((t) => t.completed).length,
		[todos],
	);

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<View style={styles.card}>
					<Header totalCount={todos.length} completedCount={completedCount} />

					{error && (
						<View style={styles.errorBanner}>
							<View style={styles.errorTextContainer}>
								<Text style={styles.errorTitle}>{"⚠️ Помилка з'єднання"}</Text>
								<Text style={styles.errorDesc}>{error}</Text>
							</View>
							<TouchableOpacity
								style={styles.retryBtn}
								onPress={() => fetchTodos()}
							>
								<Text style={styles.retryBtnText}>Повторити</Text>
							</TouchableOpacity>
						</View>
					)}

					<TodoForm onAdd={handleAdd} loading={loading} />

					{loading && !refreshing && todos.length === 0 ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="large" color="#6366f1" />
							<Text style={styles.loadingText}>Завантаження...</Text>
						</View>
					) : (
						<View style={styles.listWrapper}>
							<TodoList
								todos={todos}
								refreshing={refreshing}
								onRefresh={() => fetchTodos(true)}
								onToggle={handleToggle}
								onDelete={handleDelete}
								onEdit={handleEdit}
							/>
						</View>
					)}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const CreateStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    errorBanner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: `${colors.danger}15`,
      borderColor: `${colors.danger}40`,
      borderWidth: 1,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 12,
      borderRadius: 10,
      gap: 12,
    },
    errorTextContainer: {
      flex: 1,
    },
    errorTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.danger,
      marginBottom: 2,
    },
    errorDesc: {
      fontSize: 12,
      color: colors.danger,
      lineHeight: 16,
    },
    retryBtn: {
      backgroundColor: colors.danger,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    retryBtnText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 32,
      gap: 8,
    },
    loadingText: {
      fontSize: 14,
      color: colors.textMuted,
    },
    listWrapper: {
      flex: 1,
    },
  });