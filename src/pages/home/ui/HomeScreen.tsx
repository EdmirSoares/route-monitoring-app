import {
    View,
    StyleSheet,
    Pressable,
    StatusBar,
    Dimensions,
} from "react-native";
import { Text } from "@/src/shared/ui/Text/Text";
import LogoWhite from "@/src/shared/assets/icons/logo_white.svg";
import { LeafletMap } from "@/src/shared/ui/LeafletMap/LeafletMap";
import { useHomeScreen } from "../model/useHomeScreen";

const { width, height } = Dimensions.get("window");
const MAP_HEIGHT = height * 0.65;

export function HomeScreen() {
    const { theme, isTracking, location, route, toggleTracking, goToSettings } = useHomeScreen();

    return (
        <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            <LeafletMap
                location={location}
                route={route}
                style={{ width, height: MAP_HEIGHT }}
            />

            <View style={styles.panels}>
                <Pressable
                    style={({ pressed }) => [
                        styles.panelLeft,
                        {
                            backgroundColor: isTracking
                                ? theme.colors.status.live
                                : theme.colors.primary.default,
                            opacity: pressed ? 0.85 : 1,
                        },
                    ]}
                    onPress={toggleTracking}
                >
                    <Text
                        weight="bold"
                        style={[styles.panelLeftText, { color: theme.colors.text.primary }]}
                    >
                        {"Moni\ntori\nng"}
                    </Text>
                    <View style={styles.brandDetailPanel}>
                        <LogoWhite width={26} height={26} />
                    </View>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.panelRight,
                        {
                            backgroundColor: theme.colors.surface,
                            opacity: pressed ? 0.8 : 1,
                        },
                    ]}
                    onPress={goToSettings}
                >
                    <Text
                        weight="bold"
                        style={[styles.panelRightText, { color: theme.colors.text.primary }]}
                    >
                        {"Set\ntin\ngs"}
                    </Text>
                    <Text style={[styles.arrowIcon, { color: theme.colors.text.primary }]}>
                        →
                    </Text>
                </Pressable>
            </View>

            <View style={styles.centerOverlay} pointerEvents="none">
                <View style={[styles.liveBadge, { backgroundColor: theme.colors.text.white }]}>
                    <View
                        style={[
                            styles.liveDot,
                            {
                                backgroundColor: isTracking
                                    ? theme.colors.status.live
                                    : theme.colors.text.secondary,
                            },
                        ]}
                    />
                    <Text
                        weight="medium"
                        style={[
                            styles.liveText,
                            {
                                color: isTracking
                                    ? theme.colors.status.live
                                    : theme.colors.text.secondary,
                            },
                        ]}
                    >
                        LIVE
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    panels: {
        flexDirection: "row",
        flex: 1,
    },
    panelLeft: {
        flex: 1,
        borderTopRightRadius: 18,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
        justifyContent: "flex-start",
        overflow: "hidden",
    },
    panelLeftText: {
        fontSize: 40,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        lineHeight: 44,
    },
    brandDetailPanel: {
        position: "absolute",
        right: 25,
        top: 25,
        opacity: 0.7,
    },
    panelRight: {
        flex: 1,
        borderTopLeftRadius: 18,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    panelRightText: {
        fontSize: 40,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        lineHeight: 44,
        textAlign: "right",
    },
    arrowIcon: {
        fontSize: 20,
        marginTop: 8,
    },
    centerOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 46,
        alignItems: "center",
    },
    liveBadge: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 10,
        gap: 6,
        marginTop: 4,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    liveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    liveText: {
        fontSize: 15,
        letterSpacing: 0.45,
    },
});
