import { Alert } from "react-native";

export async function confirm(title: string, message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        Alert.alert(title, message, [
            {
                text: "Cancelar",
                onPress: () => resolve(false),
                style: "cancel"
            },
            {
                text: "Confirmar",
                onPress: () => resolve(true)
            }
        ]);
    });
}