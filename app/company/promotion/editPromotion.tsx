import { MainView } from "@/components/layout/MainView";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { GoldButton } from "@/components/ui/GoldButton";
import Loading from "@/components/ui/Loading";
import { Paths } from "@/constants/Paths";
import { StdStyles } from "@/constants/Styles";
import { useAuth } from "@/context/authContext";
import { asyncEditPromotionName, asyncGetPromotion } from "@/firebase/promotion/repository";
import { Promotion, promotionErrorToUser } from "@/firebase/promotion/types";
import { validPromotionName } from "@/firebase/promotion/validation";
import headerConfig from "@/helper/headerConfig";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";


export default function EditPromotion() {
    const [user, loading] = useAuth();
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [name, setName] = useState("");
    const [errors, setErrors] = useState([] as string[]);
    headerConfig({ title: promotion?.name || "Promoção" });
    const route = useRoute();
    const { uid } = route.params as { uid: string };
    useEffect(() => {
        if (user && uid) {
            asyncGetPromotion(user, uid).then(setPromotion).catch(console.error);
        }
    }, [user, uid])

    if (loading) {
        return null;
    }

    async function save() {
        if (!user) return;

        if (!promotion) {
            setErrors(["Promoção não encontrada."]);
            return;
        }

        const errors = validPromotionName(name);
        if (!promotion || errors.length > 0) {
            setErrors(errors.map(promotionErrorToUser));
            return;
        }

        await asyncEditPromotionName(promotion, user, name).then((result) => {
            if (result instanceof Array) {
                setErrors(result);
            } else {
                router.navigate(Paths.PROMOTION);
            }
        })
    }

    return (
        <Root requireAuth>
            <MainView>
                { !promotion && <Loading />}
                { promotion && (
                    <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                        { errors.map(error => <Text key={error} style={styles.errorText}>{error}</Text>)}
                        <FormInput value={name} setValue={setName} label="Nome da promoção"/>
                        <GoldButton style={styles.saveButton} title="Salvar" onPress={save}/>
                    </View>
                )}
            </MainView>
        </Root>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15
    },
    saveButton: {
        marginTop: 15
    },
    errorText: {
        color: "red"
    }
})