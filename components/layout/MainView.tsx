import { Colors } from "@/constants/Colors";
import { StdStyles } from "@/constants/Styles";
import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";
import Animated, { AnimatedScrollViewProps } from "react-native-reanimated";

interface Props extends AnimatedScrollViewProps {

}

type MainViewProps = PropsWithChildren<Props>;

export function MainView({ children, style, ...rest }: AnimatedScrollViewProps) {
    return ( 
    <Animated.ScrollView contentContainerStyle={[StdStyles.mainContainer, style]} style={{ backgroundColor: Colors.background }} {...rest}>
        {children}
    </Animated.ScrollView>
    )
}