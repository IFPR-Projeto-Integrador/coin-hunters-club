import { Alert, Platform } from "react-native";

export async function confirm(title: string, message: string): Promise<boolean> {
    if (Platform.OS === "android") {
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
    else if (Platform.OS === "web") {
        return new Promise<boolean>((resolve) => {
            resolve(window.confirm(message));
        })
    }
    
    throw new Error("Plataforma não suportada para a função confirm");
}