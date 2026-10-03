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

export default function SignUpScreen() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Помилка", "Будь ласка, заповніть усі обов'язкові поля!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Помилка", "Паролі не співпадають!");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Помилка", "Пароль має містити мінімум 8 символів!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("flow", "signUp");

      await signIn("password", formData);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Помилка реєстрації",
        "Не вдалося створити профіль. Можливо, такий email вже використовується."
      );
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
              <MaterialIcons name="person-add" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Новий акаунт</Text>
            <Text style={styles.subtitle}>
              Створіть профіль для збереження ваших списків справ
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="person-outline"
                size={22}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Ваше ім'я"
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.textMuted}
              />
            </View>

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
                placeholder="Пароль (мін. 8 символів)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="verified-user"
                size={22}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Підтвердження пароля"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="how-to-reg" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Зареєструватися</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Вже маєте акаунт?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>Увійти</Text>
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
      marginBottom: 32,
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
      gap: 14,
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
      paddingVertical: 15,
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
      marginTop: 28,
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