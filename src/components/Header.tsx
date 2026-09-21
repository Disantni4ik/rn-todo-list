import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.headerTitleGroup}>
        <Text style={styles.headerIcon}>📝</Text>
        <Text>Мій Список Завдань</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        {totalCount > 0
          ? `Виконано ${completedCount} з ${totalCount} завдань`
          : "Додайте своє перше завдання"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerSubtitle: {
    color: 'gray',
    fontSize: 11,
    fontWeight: 400
  }
})