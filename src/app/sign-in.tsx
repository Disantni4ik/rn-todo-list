import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { useAuthActions } from "@convex-dev/auth/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Помилка", "Будь ласка, заповніть усі поля!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("flow", "signIn");

      await signIn("password", formData);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Помилка входу", "Невірний email або пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="check-circle" size={44} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Todo App</Text>
            <Text style={styles.subtitle}>
              Увійдіть у свій персональний простір завдань
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="mail-outline"
                size={22}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock-outline"
                size={22}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="login" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Увійти</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Немає облікового запису?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")}>
              <Text style={styles.footerLink}>Зареєструватися</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    header: {
      alignItems: "center",
      marginBottom: 36,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 6,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.textMuted,
      textAlign: "center",
      lineHeight: 20,
    },
    form: {
      gap: 16,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBg,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 16,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text,
    },
    button: {
      flexDirection: "row",
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 8,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "700",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 32,
    },
    footerText: {
      fontSize: 15,
      color: colors.textMuted,
    },
    footerLink: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.primary,
    },
  });