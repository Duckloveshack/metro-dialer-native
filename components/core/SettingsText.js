import { Text, TouchableWithoutFeedback, View } from "react-native";
import { fonts } from "../../styles/fonts";
import { useState } from "react";
import { MetroTheme } from "../../styles/theme";

export const SettingsText = ({ children, title, classOverride = "" }) => {
    return (
        <View className={`flex ${classOverride}`}>
            <Text className="text-base mb-1" style={[fonts.light, { color: MetroTheme.description}]}>
                {title}
            </Text>
            <Text className="text-white text-3xl" style={[fonts.light, { color: MetroTheme.active }]}>
                {children}
            </Text>
        </View>
    )
};