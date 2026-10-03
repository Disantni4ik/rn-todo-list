import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
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

  const { signOut } = useAuthActions();
  const router = useRouter();

  const [loadingAction, setLoadingAction] = useState<"completed" | "all" | null>(null);

  // Якщо дані юзера та логаут підтягуються з хука аутентифікації:
  const user = useQuery(api.users.currentUser)
  // const user = { name: "Олександр", email: "alex@example.com" }; // підставте ваш useAuth / useQuery(api.users.current)
  const handleSignOut = () => {
    Alert.alert("Вихід з акаунта", "Ви впевнені, що хочете вийти з додатку?", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Вийти",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/sign-in");
        },
      },
    ]);
  };

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
              const count = res?.deletedCount ?? 0;
              Alert.alert("Успішно", `Видалено ${count} завдань`);
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
              const count = res?.deletedCount ?? 0;
              Alert.alert("Успішно", `Базу очищено. Видалено ${count} завдань`);
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

        <View
          style={[
            styles.userCard,
            { backgroundColor: colors.card ?? colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="person" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name ?? "Користувач"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email ?? ""}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleSignOut}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="logout" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

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
    /* Додані відсутні стилі для блоку профілю */
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    userInfo: {
      flex: 1,
      marginLeft: 14,
    },
    userName: {
      fontSize: 17,
      fontWeight: "700",
    },
    userEmail: {
      fontSize: 13,
      marginTop: 2,
    },
    signOutBtn: {
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    /* Секції та елементи меню */
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