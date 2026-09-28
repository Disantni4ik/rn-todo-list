import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../convex/_generated/api";

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [loadingAction, setLoadingAction] = useState<"completed" | "all" | null>(null);

  const clearCompleted = useMutation(api.todos.clearCompleted);
  const clearAll = useMutation(api.todos.clearAll);

  const handleClearCompleted = () => {
    Alert.alert(
      "Очистити виконані",
      "Ви впевнені, що хочете видалити всі виконані завдання з бази?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              setLoadingAction("completed");
              const res = await clearCompleted();
              Alert.alert("Успішно", `Видалено ${res.deletedCount} завдань`);
            } catch (err: any) {
              Alert.alert("Помилка", err?.data || "Не вдалося очистити виконані завдання");
              console.error(err);
            } finally {
              setLoadingAction(null);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Видалити ВСІ завдання",
      "Цю дію неможливо скасувати. Видалити всі завдання з хмари Convex?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити все",
          style: "destructive",
          onPress: async () => {
            try {
              setLoadingAction("all");
              const res = await clearAll();
              Alert.alert("Успішно", `Базу очищено. Видалено ${res.deletedCount} завдань`);
            } catch (err: any) {
              Alert.alert("Помилка", err?.data || "Не вдалося видалити завдання");
              console.error(err);
            } finally {
              setLoadingAction(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>Налаштування</Text>

        <Text style={styles.sectionHeader}>Зовнішній вигляд</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: isDarkMode ? "#38BDF820" : "#F59E0B20" },
                ]}
              >
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny"}
                  size={20}
                  color={isDarkMode ? "#38BDF8" : "#F59E0B"}
                />
              </View>
              <Text style={styles.rowText}>
                {isDarkMode ? "Темна тема" : "Світла тема"}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#E2E8F0", true: colors.primary }}
              thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
            />
          </View>
        </View>

        <Text style={styles.sectionHeader}>Керування хмарою Convex</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={handleClearCompleted}
            activeOpacity={0.7}
            disabled={loadingAction !== null}
          >
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: `${colors.danger}15` },
                ]}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={20}
                  color={colors.danger}
                />
              </View>
              <Text style={styles.rowText}>Видалити виконані завдання</Text>
            </View>
            {loadingAction === "completed" ? (
              <ActivityIndicator size="small" color={colors.danger} />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.row}
            onPress={handleClearAll}
            activeOpacity={0.7}
            disabled={loadingAction !== null}
          >
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: `${colors.danger}15` },
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.danger}
                />
              </View>
              <Text style={[styles.rowText, { color: colors.danger }]}>
                Видалити абсолютно всі завдання
              </Text>
            </View>
            {loadingAction === "all" ? (
              <ActivityIndicator size="small" color={colors.danger} />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Інформація</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: `${colors.primary}15` },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.rowText}>Версія додатку</Text>
            </View>
            <Text style={styles.infoBadgeText}>v3.0.0 (Convex Cloud)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: `${colors.primary}15` },
                ]}
              >
                <Ionicons
                  name="checkbox-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.rowText}>Назва додатку</Text>
            </View>
            <Text style={styles.infoBadgeText}>Todo Flow</Text>
          </View>
        </View>
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
      paddingVertical: 12,
    },
    screenTitle: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 20,
    },
    sectionHeader: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 8,
      marginLeft: 4,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: colors.statusBarStyle === "light" ? 0.25 : 0.05,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    rowText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    infoBadgeText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textMuted,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginLeft: 64,
    },
  });