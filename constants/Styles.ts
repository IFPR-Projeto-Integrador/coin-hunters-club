import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const StdStyles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.background,
        position: "relative",
        zIndex: 0,
    },

    secondaryContainer: {
        width: "80%",
        justifyContent: 'flex-start',
        backgroundColor: Colors.panel,
        paddingVertical: 15,
        marginVertical: 15,
        borderRadius: 15,
    }
})