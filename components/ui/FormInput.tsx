import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, Keyboard } from 'react-native';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { dateToString, isDateStringDDMMYYYY, stringToDate } from '@/helper/dates';

interface Props {
    label: string;
    setValue: (value: string) => void;
    value: string;
    password?: boolean;
    date?: boolean;
    number?: boolean;
    placeholder?: string;
    inputBackgroundColor?: string;
};

export function FormInput({ placeholder, label, value, setValue, inputBackgroundColor, password = false, date = false, number = false }: Props) {
  let changeTextFunc = undefined;

  if (number) {
    changeTextFunc = (text: string) => {
      if (/^\d+$/.test(text) || text === "") {
        setValue(text);
      }
    };
  } else if (date) {
    changeTextFunc = undefined;
  } 
  else {
    changeTextFunc = setValue;
  }
  

  function openedDatePicker() {
    Keyboard.dismiss();

    const currentlySelectedDate = isDateStringDDMMYYYY(value) ? stringToDate(value) : new Date();

    DateTimePickerAndroid.open({ 
      mode: 'date', 
      value: currentlySelectedDate,
      onChange: async (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          setValue(dateToString(selectedDate));
        }

        await DateTimePickerAndroid.dismiss('date');
      } 
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label ?? ""}</Text>
      <TextInput
        keyboardType={number ? "number-pad" : "default"}
        secureTextEntry={password}
        value={value}
        onChangeText={changeTextFunc}
        onFocus={date ? openedDatePicker : undefined}
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
