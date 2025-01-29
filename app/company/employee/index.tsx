import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { asyncGetEmployees, asyncMarkEmployeeForDeletion, CHCUser } from "@/firebase/user/user";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import IconButton from "@/components/ui/IconButton";
import Loading from "@/components/ui/Loading";
import { confirmPopup } from "@/helper/popups";
import { useIsFocused } from "@react-navigation/native";

export default function IndexCompanyEmployee() {
    const [user, loading] = useAuth();
    const isFocused = useIsFocused();

    const [employees, setEmployees] = useState<CHCUser[] | null>(null);
    const [reloadEffect, setReloadEffect] = useState(false);

    useEffect(() => {
        if (!isFocused) return;
        
        asyncGetEmployees().then(setEmployees).catch(console.error)
    }, [user, reloadEffect, isFocused])

    if (loading)
        return null;

    if (!user)
        return null;

    async function deleteEmployee(uid: string) {
        if (await confirmPopup("Deletar funcionário", "Deseja realmente deletar este funcionário?")) {
            await asyncMarkEmployeeForDeletion(uid);
            setReloadEffect(true);
        }
    }

    return (
        <Root requireAuth>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <GoldButton title="Cadastrar Funcionário" onPress={() => router.navigate(`${Paths.REGISTER}?uidEmpresa=${user.uid}`)} style={[styles.button]}/>
                </View>
                    { !employees && <Loading />}
                    { employees?.length === 0 && <Text>Nenhum funcionário cadastrado</Text>}
                    { employees && employees.map((employee, index) => (
                        <View key={employee.uid} style={[StdStyles.secondaryContainer, styles.mainContainer, styles.employeeCard]}>
                            <View>
                                <Text style={{ marginBottom: 5}}>Nome: {employee.nome}</Text>
                                <Text>Email: {employee.email}</Text>
                            </View>
                            <IconButton icon="trash" style={styles.deleteIcon} onPress={async () => await deleteEmployee(employee.uid)}/>
                        </View>
                    ))}
            </MainView>
        </Root>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15
    },
    button: {
        marginVertical: 10
    },
    employeeCard: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    deleteIcon: {
        backgroundColor: Colors.error,
        borderRadius: 100,
        width: 45
    }
})