import { Paths } from "@/constants/Paths";
import { StdStyles } from "@/constants/Styles";
import { Reward } from "@/firebase/reward/types";
import { router } from "expo-router";
import React from "react";
import { Pressable, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface RewardCardProps {
    reward: Reward;
    onPress?: (reward: Reward) => void;
    onLongPress?: (reward: Reward) => void;
    imageSize?: number;
    fontSize?: number;
    backgroundColor?: string;
    borderRadius?: number;
}

export default function RewardCard({ reward, onPress, onLongPress, imageSize, fontSize, backgroundColor, borderRadius = 15 }: RewardCardProps) {
    return ( 
    <TouchableOpacity
            style={[StdStyles.secondaryContainer, styles.itemContainer, backgroundColor ? { backgroundColor: backgroundColor } : undefined,
                borderRadius ? undefined : { borderRadius: 0 }
            ]}
            onPress={onPress ? () => onPress(reward) : undefined}
            onLongPress={onLongPress ? () => onLongPress(reward) : undefined}>
        <Image 
            source={{ uri: reward.imageBase64 }} 
            style={[styles.image, imageSize ? { width: imageSize, height: imageSize, marginRight: imageSize * 0.3 } : undefined ]}/>
        <View style={styles.textContainer}>
            <Text style={[styles.itemText, fontSize ? { fontSize: fontSize } : undefined ]}>Nome: {reward.name}</Text>
            <Text style={[styles.itemText, fontSize ? { fontSize: fontSize } : undefined ]}>Descrição: {reward.description}</Text>
        </ View>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        marginRight: 30,
    },
    itemContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        width: "100%",
    },
    textContainer: {
        justifyContent: 'center',
        flex: 1
    },
    itemText: {
        fontSize: 18,
    },
});