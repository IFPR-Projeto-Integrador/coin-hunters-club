import { Image, StyleSheet } from "react-native"

interface Props {
    width?: number;
    height?: number;
}

export function CHCLogo({ width = 300, height = 300}: Props) {

    const dimensions = {
        width: width,
        height: height,
    }

    return (
            <Image source={require('../../assets/images/CHC Logo.png')} style={dimensions} />
    )
}