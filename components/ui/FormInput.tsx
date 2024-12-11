import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TextInputBase, ViewProps } from 'react-native';

interface Props {
    label: string;
    setValue: (value: string) => void;
    value: string;
    password?: boolean;
    placeholder?: string;
    inputBackgroundColor?: string;
};

export function FormInput({ placeholder, label, value, setValue, inputBackgroundColor, password = false }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label ?? ""}</Text>
      <TextInput
        secureTextEntry={password}
        value={value ?? ""}
        onChangeText={setValue}
        placeholder={placeholder ?? "Digite algo..."}
        style={[styles.input, inputBackgroundColor && { backgroundColor: inputBackgroundColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 5,
    height: "auto"
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  input: {
    width: '100%',
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#f7f7f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    outlineColor: Colors.primary,
  },
});
