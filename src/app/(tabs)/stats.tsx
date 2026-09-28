import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { getTodos } from "@/services/api";
import { Todo } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Stats() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { colors } = useTheme();
    const styles = useMemo(() => CreateStyles(colors), [colors]);

    const fetchTodos = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const data = await getTodos();
            setTodos(data);
        } catch (err) {
            setError(
                "Не вдалося з'єднатися з сервером. Переконайтеся, що json-server запущено (порт 3000)."
            );
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const stats = useMemo(() => {
        const total = todos.length;
        const completed = todos.filter((t) => t.completed).length;
        const active = total - completed;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, active, rate };
    }, [todos]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchTodos(true)}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                <Text style={styles.screenTitle}>Аналітика</Text>

                {error && (
                    <View style={styles.errorBanner}>
                        <View style={styles.errorTextContainer}>
                            <Text style={styles.errorTitle}>Помилка</Text>
                            <Text style={styles.errorDesc}>{error}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.retryBtn}
                            onPress={() => fetchTodos()}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.retryBtnText}>Повторити</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Завантаження статистики...</Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        <View style={styles.statCard}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: `${colors.primary}1A` },
                                ]}
                            >
                                <Ionicons name="layers-outline" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.statValue}>{stats.total}</Text>
                            <Text style={styles.statTitle}>Всього завдань</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: "#F59E0B1A" },
                                ]}
                            >
                                <Ionicons name="time-outline" size={24} color="#F59E0B" />
                            </View>
                            <Text style={styles.statValue}>{stats.active}</Text>
                            <Text style={styles.statTitle}>В процесі</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: `${colors.success}1A` },
                                ]}
                            >
                                <Ionicons
                                    name="checkmark-done-circle-outline"
                                    size={24}
                                    color={colors.success}
                                />
                            </View>
                            <Text style={styles.statValue}>{stats.completed}</Text>
                            <Text style={styles.statTitle}>Виконані</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: "#8B5CF61A" },
                                ]}
                            >
                                <Ionicons name="trending-up-outline" size={24} color="#8B5CF6" />
                            </View>
                            <Text style={styles.statValue}>{stats.rate}%</Text>
                            <Text style={styles.statTitle}>Виконання</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const CreateStyles = (colors: ThemeColors) =>
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
            marginBottom: 16,
        },
        grid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: 14,
        },
        statCard: {
            width: "48%",
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            ...Platform.select({
                ios: {
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.06,
                    shadowRadius: 10,
                },
                android: {
                    elevation: 3,
                },
            }),
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
        },
        statValue: {
            fontSize: 24,
            fontWeight: "800",
            color: colors.text,
            marginBottom: 4,
        },
        statTitle: {
            fontSize: 13,
            fontWeight: "500",
            color: colors.textMuted,
        },
        errorBanner: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: `${colors.danger}15`,
            borderColor: `${colors.danger}40`,
            borderWidth: 1,
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            gap: 12,
        },
        errorTextContainer: {
            flex: 1,
        },
        errorTitle: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.danger,
            marginBottom: 2,
        },
        errorDesc: {
            fontSize: 12,
            color: colors.danger,
            lineHeight: 16,
        },
        retryBtn: {
            backgroundColor: colors.danger,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
        },
        retryBtnText: {
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: "600",
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 64,
            gap: 10,
        },
        loadingText: {
            fontSize: 14,
            color: colors.textMuted,
        },
    });