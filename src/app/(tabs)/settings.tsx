import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
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

type SettingsProps = {
    onClearCompleted?: () => Promise<void> | void;
    onClearAll?: () => Promise<void> | void;
};

export default function Settings({ onClearCompleted, onClearAll }: SettingsProps) {
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const styles = useMemo(() => CreateStyles(colors), [colors]);

    const [processing, setProcessing] = useState(false);

    const handleClearCompleted = () => {
        Alert.alert(
            "Очистити виконані",
            "Ви впевнені, що хочете видалити всі виконані завдання?",
            [
                { text: "Скасувати", style: "cancel" },
                {
                    text: "Видалити",
                    style: "destructive",
                    onPress: async () => {
                        if (!onClearCompleted) return;
                        try {
                            setProcessing(true);
                            await onClearCompleted();
                        } finally {
                            setProcessing(false);
                        }
                    },
                },
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            "Видалити всі завдання",
            "Ця дія є незворотною. Усі ваші завдання буде видалено.",
            [
                { text: "Скасувати", style: "cancel" },
                {
                    text: "Видалити все",
                    style: "destructive",
                    onPress: async () => {
                        if (!onClearAll) return;
                        try {
                            setProcessing(true);
                            await onClearAll();
                        } finally {
                            setProcessing(false);
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

                <Text style={styles.sectionHeader}>Керування даними</Text>
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={handleClearCompleted}
                        activeOpacity={0.7}
                        disabled={processing}
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
                            <Text style={styles.rowText}>Очистити виконані завдання</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.row}
                        onPress={handleClearAll}
                        activeOpacity={0.7}
                        disabled={processing}
                    >
                        <View style={styles.rowLeft}>
                            <View
                                style={[
                                    styles.iconWrap,
                                    { backgroundColor: `${colors.danger}15` },
                                ]}
                            >
                                <Ionicons name="trash-outline" size={20} color={colors.danger} />
                            </View>
                            <Text style={[styles.rowText, { color: colors.danger }]}>
                                Видалити всі завдання
                            </Text>
                        </View>
                        {processing ? (
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
                        <Text style={styles.infoBadgeText}>v2.0.0</Text>
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
            marginBottom: 20,
        },
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
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.05,
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