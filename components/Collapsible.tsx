import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ViewProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import Icon from "@expo/vector-icons/FontAwesome";

export function Collapsible({ children, title, style, fontSize }: ViewProps & { title: string, fontSize?: number } ) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.4}>
        <Text style={{ fontSize: fontSize  }}>{title}</Text>
        <Icon
          name="arrow-right"
          size={18}
          weight="medium"
          color={ Colors.fontColor }
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginHorizontal: 0,
  },
});
