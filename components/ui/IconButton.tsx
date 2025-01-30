import React, { useState } from "react";
import { Modal, Pressable, PressableProps, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { confirmPopup } from "@/helper/popups";
import Loading from "./Loading";

type FontAwesomeIconNames = keyof typeof Icon.glyphMap;

interface Props extends TouchableOpacityProps {
    onPress?: (() => void) | (() => Promise<void>);
    icon?: FontAwesomeIconNames;
    size?: number;
    color?: string;
    showLoading?: boolean;
}

export default function IconButton({ onPress, icon, size = 24, color = "black", showLoading = false, style, ...rest }: Props) {
    const [loading, setLoading] = useState(false);

    async function onPressAction() {
      if (!onPress) return;
      
      if (showLoading) {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      try {
        await onPress();
      }
      catch(e) {
        confirmPopup("Erro", "Um erro ocorreu enquanto tentávamos realizar a ação. Por favor, tente novamente mais tarde.");
      }
      finally {
        setLoading(false);
      }
    }
  
  return (
    <TouchableOpacity style={[styles.button, 
                      style]} onPress={onPressAction} {...rest} >
      <Icon name={icon} size={size} color={color} />
      { loading && (
                  <Modal style={styles.loadingModal} transparent animationType='fade'>
                    <Loading transparent/>
                  </Modal>
                ) }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
});
