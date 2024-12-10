import ProtectedRoute from "@/components/ProtectedRoute";
import { Text } from "react-native"

export default function IndexFuncionario() {
    return (
        <ProtectedRoute>
            <Text>Funcionario</Text>
        </ProtectedRoute>
    )
}