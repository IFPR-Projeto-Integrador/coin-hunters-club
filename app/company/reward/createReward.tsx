import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StyleSheet, View, Image, Platform, Text } from "react-native";
import { router } from "expo-router";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Reward, rewardErrorToUser } from "@/firebase/reward/types";
import { uriToBase64 } from "@/helper/images";
import * as Rewards from "@/firebase/reward/repository";
import { useAuth } from "@/context/authContext";

export default function CreateReward() {
  const [user, loading] = useAuth();

  if (loading) {
    return null;
  }

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [error, setError] = useState<string[] | null>(null);

  const openGalleryWithCrop = async (): Promise<void> => {
    try {
      // Request permissions for media library access
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert("Permission to access media library is required!");
        return;
      }

      // Open the image picker with cropping enabled
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true, // Enable cropping
        aspect: [1, 1], // Crop to square aspect ratio
        quality: 1, // Maximum image quality
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

    const reward: Reward = {
      name,
      description,
      imageBase64: imageUri ?? "",
    }

    const result = await Rewards.asyncCreateReward(reward, user);

    if ("length" in result) {
      const errors = result.map((e) => rewardErrorToUser(e));
      setError(errors);
      return;
    }
    
    router.navigate(Paths.REWARD);
  }

  return (
    <Root requireAuth>
      <MainView>
        <View style={styles.container}>
          <GoldButton title="Selecionar Imagem" onPress={openGalleryWithCrop} />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        </View>
        <View style={styles.mainContainer}>
          <FormInput label="Nome" setValue={setName} value={name} />
          <FormInput label="Descrição" setValue={setDescription} value={description} />
          <GoldButton
            title="Salvar"
            onPress={save}
            style={styles.button}
          />

          {error && error.map((e) => <Text key={e} style={styles.error}>{e}</Text>)}
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