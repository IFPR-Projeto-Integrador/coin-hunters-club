import React from "react";
import { Pressable, PressableProps, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

type FontAwesomeIconNames = keyof typeof Icon.glyphMap;

interface Props extends PressableProps {
    onPress?: () => void;
    icon?: FontAwesomeIconNames;
    size?: number;
    color?: string;
}

export default function IconButton({ onPress, icon, size = 24, color = "black", style, ...rest }: Props) {

  
  return (
    <Pressable style={[styles.button, // @ts-expect-error 
                      style]} onPress={onPress} {...rest} >
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
