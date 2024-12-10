import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const StdStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },

    secondaryContainer: {
        width: "80%",
        justifyContent: 'flex-start',
        backgroundColor: Colors.panel,
        paddingVertical: 15,
        marginVertical: 15,
    }
})