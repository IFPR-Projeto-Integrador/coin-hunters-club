import Root from "@/components/Root";
import { Paths } from "@/constants/Paths";
import { Redirect } from "expo-router";
import { Text } from "react-native"

export default function IndexCliente() {
    
    return (
        <Redirect href={Paths.SOON}/>
    )
}