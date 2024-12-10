import ProtectedRoute from "@/components/ProtectedRoute";
import { Text } from "react-native"

export default function IndexCliente() {
    
    return (
        <ProtectedRoute>
            <Text>Cliente</Text>
        </ProtectedRoute>
    )
}