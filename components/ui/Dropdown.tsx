import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
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
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelect = (value: string | number) => {
    onSelect(value);
    setModalVisible(false);
  };

  return (
    <View style={[style]} {...rest}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleModal}>
        {icon ? (
          <Icon name={icon} size={20} color={Colors.fontColor} />
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
          <View style={styles.modalContent}>
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
        </TouchableOpacity>
      </Modal>
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
  },
  placeholder: {
    fontSize: 16,
    color: Colors.fontColor,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 10,
    width: 250,
    maxHeight: 300,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryDarker,
  },
  optionText: {
    fontSize: 16,
    color: Colors.fontColor,
  },
});
