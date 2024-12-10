import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

type FontAwesomeIconNames = keyof typeof Icon.glyphMap;

interface Props {
    onPress?: () => void;
    icon?: FontAwesomeIconNames;
    size?: number;
    color?: string;
}

export default function IconButton({ onPress, icon, size = 24, color = "black" }: Props) {
  const navigation = useNavigation();


  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Icon name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
