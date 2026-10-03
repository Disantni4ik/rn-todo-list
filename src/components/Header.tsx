import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.appHeader}>
      <View style={styles.headerTitleGroup}>
        <Text style={styles.headerIcon}>📝</Text>
        <Text style={styles.headerTitle}>Мій Список Завдань</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        {totalCount > 0
          ? `Виконано ${completedCount} з ${totalCount} завдань`
          : "Додайте своє перше завдання"}
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    appHeader: {
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerTitleGroup: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginBottom: 6,
    },
    headerIcon: {
      fontSize: 24,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
    },
    headerSubtitle: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "500",
    },
  });