import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  const {colors} = useTheme()
  const styles = CreateStyles(colors)

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

const CreateStyles = (colors: ThemeColors) => StyleSheet.create({
  appHeader: {
    marginBottom: 24,
    textAlign: 'center'
  },
  headerTitleGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 6
  },
  headerIcon: {
    fontSize: 24
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 700
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: 400
  }
})