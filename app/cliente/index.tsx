import Root from "@/components/Root";
import { Text } from "react-native"

export default function IndexCliente() {
    
    return (
        <Root requireAuth={true}>
            <Text>Cliente</Text>
        </Root>
    )
}