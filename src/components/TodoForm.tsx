import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { colors } = useTheme();
  const styles = CreateStyles(colors);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(trimmed);
      setText("");
      Keyboard.dismiss()
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
        onSubmitEditing={handleSubmit}
      />
      <Pressable
        onPress={handleSubmit}
        style={styles.todoAddBtn}
        disabled={!text.trim() || loading || isSubmitting}
      >
        <Text>{isSubmitting ? "Додаємо..." : "Додати"}</Text>
      </Pressable>
    </View>
  );
}

const CreateStyles = (colors: ThemeColors) => StyleSheet.create({
  todoInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 12,
    fontFamily: 'inherit',
    borderRadius: 12,
    backgroundColor: colors.bg,
    color: colors.text,
  },
  todoForm: {
    display: 'flex',
    gap: 10,
    marginBottom: 24
  },
  todoAddBtn: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    fontWeight: '600',
    fontSize: 11,
  }
})