import { Colors } from '@/constants/Colors';
import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  active?: boolean;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function GoldButton ({ title, onPress, textStyle, disabled = false, active = false, style, ...toucheableOpacity }: ButtonProps) {
    console.log(active);
    return (
        <TouchableOpacity
        style={[styles.button, style, disabled && styles.disabled, active && styles.active]}
        { ...toucheableOpacity }
        onPress={onPress}
        disabled={disabled}
        >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

// Default styles
const styles = StyleSheet.create({
    button: {
      backgroundColor: Colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: Colors.fontColor,
      fontSize: 16,
      fontWeight: 'bold',
    },
    disabled: {
      backgroundColor: '#cccccc',
    },
    active: {
        backgroundColor: Colors.primaryActive,
    }
});