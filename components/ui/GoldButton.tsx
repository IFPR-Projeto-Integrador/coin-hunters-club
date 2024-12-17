import { Colors } from '@/constants/Colors';
import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  active?: boolean;
  danger?: boolean;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function GoldButton ({ title, onPress, textStyle, disabled = false, active = true, danger = false, style, ...toucheableOpacity }: ButtonProps) {
    return (
        <TouchableOpacity
        style={[styles.button, style, disabled && styles.disabled, active && styles.active, danger && styles.danger]}
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
      backgroundColor: Colors.primaryLighter,
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
    danger: {
      backgroundColor: Colors.error
    },
    active: {
        backgroundColor: Colors.primary,
    }
});