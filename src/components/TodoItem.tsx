import { useState } from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }

    if (trimmed !== todo.text) {
      try {
        setIsUpdating(true);
        await onEdit(todo.id, trimmed);
      } finally {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, isUpdating && styles.updating]}>
      <TouchableOpacity
        style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}
        onPress={() => onToggle(todo.id, !todo.completed)}
        disabled={isUpdating}
        activeOpacity={0.7}
      >
        {todo.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            onBlur={handleSave}
            onSubmitEditing={handleSave}
            returnKeyType="done"
            autoFocus
            maxLength={120}
            editable={!isUpdating}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={() => setIsEditing(true)}
            disabled={isUpdating}
          >
            <Text
              style={[
                styles.todoText,
                todo.completed && styles.todoTextCompleted,
              ]}
              numberOfLines={2}
            >
              {todo.text}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actions}>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsEditing(true)}
            disabled={isUpdating}
            activeOpacity={0.6}
          >
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleCancel}
            disabled={isUpdating}
            activeOpacity={0.6}
          >
            <Text style={styles.actionIcon}>✕</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(todo.id)}
          disabled={isUpdating}
          activeOpacity={0.6}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  updating: {
    opacity: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  editInput: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 16,
  },
});