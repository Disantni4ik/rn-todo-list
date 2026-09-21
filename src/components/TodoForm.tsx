import { Color } from "expo-router";
import { useState, type FormEvent } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

const styles = StyleSheet.create({
  todoInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 12,
    fontFamily: 'inherit',
    borderRadius: 12,
    backgroundColor: '#f8fafc'
  },
  todoForm: {
    display: 'flex',
    gap: 10,
    marginBottom: 24
  },
  todoAddBtn: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    fontWeight: '600',
    fontSize: 11,
  }
})