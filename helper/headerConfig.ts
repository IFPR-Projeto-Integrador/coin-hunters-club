import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";

interface HeaderConfigParams {
    title?: string;
    show?: boolean;
}

interface HeaderConfigObj {
    headerTitleAlign: "center";
    headerTintColor: string;
    headerStyle: { backgroundColor: string };
    headerTitle: string;
    headerShown: boolean;
}

export function header({ title, show }: HeaderConfigParams): HeaderConfigObj {
    return {
      headerTitleAlign: "center",
      headerTintColor: Colors.fontColor,
      headerStyle: { backgroundColor: Colors.primary },
      headerTitle: title ?? "",
      headerShown: show ?? true,
    }
  }

export default function headerConfig(headerConfig: HeaderConfigObj | HeaderConfigParams) {
    const navigation = useNavigation();

    useEffect(() => {
        if ("title" in headerConfig) {
            const headerConfigObj = header(headerConfig);
            navigation.setOptions(headerConfigObj);
        }
        else {
            navigation.setOptions(headerConfig);
        }
    }, [navigation, headerConfig]);
}



