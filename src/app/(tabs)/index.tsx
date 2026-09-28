import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { useMutation, useQuery } from "convex/react";
import { useMemo } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function Index() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const todos = useQuery(api.todos.getTodos);

  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const completedCount = useMemo(
    () => todos?.filter((t) => t.isCompleted).length ?? 0,
    [todos]
  );

  const handleAdd = async (text: string) => {
    try {
      await createTodo({ text });
    } catch (err: any) {
      Alert.alert("Помилка", err?.data || "Не вдалося створити завдання.");
      console.error(err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodo({ id: id as Id<"todos"> });
    } catch (err) {
      Alert.alert("Помилка", "Не вдалося змінити статус завдання.");
      console.error(err);
    }
  };

  const handleEdit = async (id: string, text: string) => {
    try {
      await updateTodo({ id: id as Id<"todos">, text });
    } catch (err: any) {
      Alert.alert("Помилка", err?.data || "Не вдалося оновити текст завдання.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo({ id: id as Id<"todos"> });
    } catch (err) {
      Alert.alert("Помилка", "Не вдалося видалити завдання.");
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Header
            totalCount={todos?.length ?? 0}
            completedCount={completedCount}
          />

          <TodoForm onAdd={handleAdd} loading={todos === undefined} />

          {todos === undefined ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Синхронізація з Convex...</Text>
            </View>
          ) : (
            <View style={styles.listWrapper}>
              <TodoList
                todos={todos}
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: colors.statusBarStyle === "light" ? 0.25 : 0.06,
          shadowRadius: 14,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 32,
      gap: 10,
    },
    loadingText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textMuted,
    },
    listWrapper: {
      flex: 1,
    },
  });