import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StyleSheet, View, Image } from "react-native";
import { router } from "expo-router";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function CreateReward() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enable cropping
        aspect: [1, 1], // Crop to square aspect ratio
        quality: 1, // Maximum image quality
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri); // Set the cropped image URI
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

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
            onPress={() => router.navigate(Paths.SOON)}
            style={styles.button}
          />
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
    }
})