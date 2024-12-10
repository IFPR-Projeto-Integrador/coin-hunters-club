import { useNavigation } from "expo-router";
import React, { useEffect } from "react";

interface HeaderConfigParams {
    title?: string;
    headerRight?: () => React.JSX.Element | null;
    show?: boolean;
}

export default function headerConfig({ title, headerRight, show }: HeaderConfigParams) {
    const navigation = useNavigation();

    useEffect(() => {
        const options: Record<string, any> = {};

        if (title) {
          options.headerTitle = title;
        }
    
        if (headerRight) {
          options.headerRight = headerRight;
        }

        if (typeof show == "boolean") {
            options.headerShown = show;
        }

        if (Object.getOwnPropertyNames(options).length === 0) {
            return;
        }   
    
        navigation.setOptions(options);
    }, [navigation]);
}