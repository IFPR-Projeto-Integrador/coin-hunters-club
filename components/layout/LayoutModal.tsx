import React, { FC, PropsWithChildren } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';

interface LayoutModalProps extends PropsWithChildren {
  isVisible: boolean;
  onClose: () => void;
  backgroundColor?: string;
  modalStyle?: StyleProp<ViewStyle>;
}

export function LayoutModal({
  isVisible,
  onClose,
  children,
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  modalStyle,
}: LayoutModalProps) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={[styles.backdrop, { backgroundColor }]} onPress={onClose} />
      <View style={styles.modalPositioning}>
        <View style={[styles.modal, modalStyle]}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  modalPositioning: {
    height: "100%", 
    width: "100%", 
    justifyContent: "center", 
    alignItems: "center"
  },
  modal: {
    width: '90%',
    height: "80%",
    backgroundColor: 'transparent',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
});
