import { Colors } from "@/constants/Colors";
import React, { ComponentType, ReactNode, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ViewProps,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";

type FontAwesomeIconNames = keyof typeof Icon.glyphMap;

interface DropdownProps extends ViewProps {
  items: { label: string; value: string | number }[];
  onSelect: (value: string | number) => void;
  placeholder?: string;
  icon?: FontAwesomeIconNames;
}

export default function Dropdown({
  items,
  onSelect,
  placeholder,
  icon,
  style,
  ...rest
}: DropdownProps) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
    console.log("Cliquei");
    setDropdownVisible(!isDropdownVisible);
    
  };

  const handleSelect = (value: string | number) => {
    onSelect(value);
    setDropdownVisible(false);
  };

  return (
    <View style={[{ backgroundColor: "red", zIndex: 9999, position: "relative", },style]} {...rest}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        { icon ? <Icon name={icon} /> : <Text style={styles.placeholder}>{placeholder}</Text> }
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 12,
    backgroundColor: Colors.primaryDarker,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  placeholder: {
    fontSize: 16,
    color: Colors.fontColor,
  },
  dropdown: {
    backgroundColor: Colors.primary,
    zIndex: 9999,
    borderWidth: 1,
    borderColor: "transparent",
    marginTop: 5,
    maxHeight: 150,
    position: "absolute",
    minWidth: 150,
    width: "100%",
    top: 0,
    //right: 0,
  },
  option: {
    padding: 10,
    paddingVertical: 5,
  },
  optionText: {
    padding: 10,
    backgroundColor: Colors.primaryLighter,
  }
});
