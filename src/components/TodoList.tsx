import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { Todo } from "@/types";
import { useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoList({
  todos,
  refreshing = false,
  onRefresh,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      contentContainerStyle={[
        styles.listContent,
        todos.length === 0 && styles.emptyListContent,
      ]}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.emptyIcon}>📝</Text>
          </View>
          <Text style={styles.emptyTitle}>Завдань немає</Text>
          <Text style={styles.emptyText}>
            Список порожній. Додайте нове завдання у формі вище!
          </Text>
        </View>
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.surface}
          />
        ) : undefined
      }
    />
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    listContent: {
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    emptyListContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    separator: {
      height: 8,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 48,
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.inputBg,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    emptyIcon: {
      fontSize: 32,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.textMuted,
      textAlign: "center",
      lineHeight: 20,
      maxWidth: 260,
    },
  });