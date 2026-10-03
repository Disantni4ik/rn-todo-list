import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isDisabled = !text.trim() || loading || isSubmitting;

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(trimmed);
      setText("");
      Keyboard.dismiss();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.todoForm}>
      <TextInput
        style={styles.todoInput}
        placeholder="Що потрібно зробити?"
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        editable={!loading && !isSubmitting}
        maxLength={120}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.todoAddBtn,
          isDisabled && styles.todoAddBtnDisabled,
          pressed && !isDisabled && styles.todoAddBtnPressed,
        ]}
        disabled={isDisabled}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.todoAddBtnText}>Додати</Text>
        )}
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    todoForm: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    todoInput: {
      flex: 1,
      height: 48,
      paddingHorizontal: 16,
      fontSize: 15,
      borderRadius: 14,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
    },
    todoAddBtn: {
      height: 48,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    todoAddBtnDisabled: {
      opacity: 0.5,
    },
    todoAddBtnPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    todoAddBtnText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },
  });