import { Text, TouchableWithoutFeedback, View } from "react-native";
import { fonts } from "../../styles/fonts";
import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { MetroTheme } from "../../styles/theme";

export const SettingsSwitch = ({ isOn=false, onChange, title, classOverride = "" }) => {
    const [toggled, setToggled] = useState(isOn);
    return (
        <View className={`flex ${classOverride}`}>
            <Text className="text-[#b0b0b0] text-base mb-1" style={[fonts.light, { color: MetroTheme.description }]}>
                {title}
            </Text>
            <View className={"flex flex-row"}>
                <Text className={'text-3xl mr-auto'} style={[fonts.light, { color: MetroTheme.active }]}>{toggled? "On": "Off"}</Text>
                <ToggleSwitch isOn={toggled} height={30} width={75} onToggle={() => {
                    setToggled(!toggled);
                    if (onChange) {
                        onChange(toggled);
                    }
                }}/>
            </View>
        </View>
    )
};