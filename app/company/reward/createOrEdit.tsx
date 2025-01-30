import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StyleSheet, View, Image, Platform, Text } from "react-native";
import { router } from "expo-router";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Reward, rewardErrorToUser } from "@/firebase/reward/types";
import { isImageTooLarge, uriToBase64 } from "@/helper/images";
import * as Rewards from "@/firebase/reward/repository";
import { useAuth } from "@/context/authContext";
import { StdStyles } from "@/constants/Styles";
import { useRoute } from "@react-navigation/native";
import Loading from "@/components/ui/Loading";
import React from "react";
import headerConfig from "@/helper/headerConfig";

export default function CreateReward() {
  const [user, loading] = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  headerConfig({ title: name });

  const [error, setError] = useState<string[] | null>(null);

  const route = useRoute<{ key: string; name: string; params: { rewardId?: string } }>();
  
  const [loadingReward, setLoadingReward] = useState(true);

  useEffect(() => {
    if (user && rewardId) {
      Rewards.asyncGetRewardById(rewardId, user)
        .then((reward) => {
          if (reward) {
            setName(reward.name);
            setDescription(reward.description);
            setImageUri(reward.imageBase64);
          }
          setLoadingReward(false);
        })
        .catch((err) => console.error(err));
    }
    else {
      setLoadingReward(false);
    }
  }, [user]);

  let rewardId: string | undefined;
  if (route) {
    rewardId = route.params.rewardId
  }

  if (loading) {
    return null;
  }

  const openGalleryWithCrop = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert("Permissão para acessar imagens é necessária.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        let base64Image = null;

        if (Platform.OS === "web") {
          base64Image = await uriToBase64(imageUri);
        }
        else {
          const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          base64Image = `data:image/jpg;base64,${base64}`;
        }
 
        setImageUri(base64Image);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  async function save() {
    if (user == null) {
      return;
    }

    if (!imageUri) return;

    if (isImageTooLarge(imageUri)) {
      setError(["Imagem muito grande. Selecione uma imagem menor."]);
      return
    }

    const reward: Reward = {
      name,
      description,
      imageBase64: imageUri ?? "",
    }

    if (!rewardId) {
      const result = await Rewards.asyncCreateReward(reward, user);

      if ("length" in result) {
        const errors = result.map((e) => rewardErrorToUser(e));
        setError(errors);
        return;
      }
    }
    else {
      reward.uid = rewardId;
      const result = await Rewards.asyncEditReward(reward, user);
  
      if (result == null) {
        setError(["Erro ao editar recompensa"]);
        return;
      }
    }
    
    router.back();
    
  }

  return (
    <Root requireAuth>
      <MainView>
        <View style={[StdStyles.secondaryContainer,styles.mainContainer]}>
          {loadingReward && <Loading />}
          {!loadingReward && 
          <>
            <View style={styles.container}>
              <GoldButton title="Selecionar Imagem" onPress={openGalleryWithCrop} />
              {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            </View>
            <View>
              <FormInput label="Nome" setValue={setName} value={name} />
              <FormInput label="Descrição" setValue={setDescription} value={description} />
              <GoldButton
                title="Salvar"
                onPress={save}
                style={styles.button}
                showLoading
              />

              {error && error.map((e) => <Text key={e} style={styles.error}>{e}</Text>)}
            </View>
          </>}
        </View>
        
      </MainView>
    </Root>
  );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        width: 200,
        height: 200,
        marginTop: 20,
      },
    mainContainer: {
        padding: 15
    },
    button: {
        marginVertical: 10
    },
    error: {
        color: "red",
    }
})