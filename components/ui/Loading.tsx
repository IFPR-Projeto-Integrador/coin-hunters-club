import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingProps {
  transparent?: boolean;
}
export default function Loading({ transparent = false }: LoadingProps) {
  return (
    <View style={[styles.container, transparent ? { backgroundColor: "rgba(0, 0, 0, 0.5)"} : undefined]} >
      <ActivityIndicator size="large" color={Colors.primaryDarker}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.panel,
    position: 'absolute',
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 999,
  },
});
