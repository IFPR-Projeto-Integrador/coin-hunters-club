import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import headerConfig from "@/helper/headerConfig";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { useState } from "react";
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';

export default function CreateReward() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); 
    const [imageUri, setImageUri] = useState<string | null>(null);

    const openGallery = (): void => {
        const options: ImageLibraryOptions = {
          mediaType: 'photo',
        };
    
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorCode) {
              console.log(`Error (${response.errorCode}): ${response.errorMessage}`);
            } else if (response.assets && response.assets.length > 0) {
              const selectedImage: Asset = response.assets[0];
              console.log('Selected image URI:', selectedImage.uri);
              setImageUri(selectedImage.uri ?? null);
              // Perform actions with the selectedImage.uri or other properties
            }
        });
    };

    return (
        <Root requireAuth>
            <MainView>
            <View style={styles.container}>
                <Button title="Open Gallery" onPress={openGallery} />
                {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            </View>
                <View style={[styles.mainContainer]}>
                    <FormInput label="Nome" setValue={setName} value={name} />
                    <FormInput label="Descrição" setValue={setDescription} value={description} />
                    <GoldButton title="Salvar" onPress={() => router.navigate(Paths.SOON)} style={[styles.button]}/>
                </View>
            </MainView>
        </Root>
    )
}

const styles = StyleSheet.create({
    container: {
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