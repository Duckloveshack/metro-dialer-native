import { Text, TouchableWithoutFeedback, View } from "react-native";
import { fonts } from "../../styles/fonts";
import { useState } from "react";

export const SettingsText = ({ children, title, classOverride = "" }) => {
    return (
        <View className={`flex ${classOverride}`}>
            <Text className="text-[#b0b0b0] text-base mb-1" style={fonts.light}>
                {title}
            </Text>
            <Text className="text-white text-3xl" style={fonts.light}>
                {children}
            </Text>
        </View>
    )
};