import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet, TouchableOpacityProps, Modal } from 'react-native';
import Loading from './Loading';
import { confirmPopup } from '@/helper/popups';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: (() => Promise<void>) | (() => void);
  active?: boolean;
  danger?: boolean;
  textStyle?: TextStyle;
  disabled?: boolean;
  showLoading?: boolean;
}

export function GoldButton ({ title, 
  onPress, 
  textStyle, 
  disabled = false, active = true, danger = false, showLoading = false, style, ...toucheableOpacity }: ButtonProps) {
    const [loading, setLoading] = useState(false);

    async function onPressAction() {
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
        <TouchableOpacity
        style={[styles.button, style, disabled && styles.disabled, active && styles.active, danger && styles.danger]}
        { ...toucheableOpacity }
        onPress={onPressAction}
        disabled={disabled}
        >
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          { /* Show a modal with a loading element if should showLoading. */}
          { loading && (
            <Modal style={styles.loadingModal} transparent animationType='fade'>
              <Loading transparent/>
            </Modal>
          ) }
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
    },
    loadingModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
});