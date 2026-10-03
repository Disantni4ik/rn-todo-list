import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../convex/_generated/api";

export default function StatsScreen() {
  const stats = useQuery(api.todos.getStats);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Аналітика</Text>

        {stats === undefined ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Оновлення аналітики...</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {/* Всього завдань */}
            <View style={styles.statCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.primary}18` },
                ]}
              >
                <Ionicons
                  name="layers-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statTitle}>Всього завдань</Text>
            </View>

            {/* В процесі */}
            <View style={styles.statCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.warning ?? "#F59E0B"}18` },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={colors.warning ?? "#F59E0B"}
                />
              </View>
              <Text style={styles.statValue}>{stats.active}</Text>
              <Text style={styles.statTitle}>В процесі</Text>
            </View>

            {/* Виконані */}
            <View style={styles.statCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.success}18` },
                ]}
              >
                <Ionicons
                  name="checkmark-done-circle-outline"
                  size={24}
                  color={colors.success}
                />
              </View>
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statTitle}>Виконані</Text>
            </View>

            {/* Відсоток виконання */}
            <View style={styles.statCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.primary}18` },
                ]}
              >
                <Ionicons
                  name="trending-up-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.statValue}>{stats.completionRate}%</Text>
              <Text style={styles.statTitle}>Прогрес виконання</Text>
            </View>
          </View>
        )}
      </ScrollView>
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
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    screenTitle: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 20,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      rowGap: 14,
    },
    statCard: {
      width: "48%",
      backgroundColor: colors.card ?? colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.statusBarStyle === "light" ? 0.25 : 0.05,
          shadowRadius: 10,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    iconContainer: {
      width: 46,
      height: 46,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 14,
    },
    statValue: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 4,
    },
    statTitle: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textMuted,
    },
    loadingContainer: {
      paddingVertical: 64,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textMuted,
    },
  });