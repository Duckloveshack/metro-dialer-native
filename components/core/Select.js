import { Text, TouchableWithoutFeedback, View } from "react-native";
import { fonts } from "../../styles/fonts";
import { useState } from "react";
import * as Animatable from "react-native-animatable"
import MetroTouchable from "./MetroTouchable";

export const Select = ({ options, defaultOption=0, onChange, title, disabled=false, classOverride = "", toggleOnColor="#a013ec" }) => {
    const [selected, setSelected] = useState(options[defaultOption]);
    const [expanded, setExpanded] = useState(false);
    return (
        <View className={`flex ${classOverride}`}>
            <Text className="text-[#b0b0b0] text-base mb-1" style={fonts.light}>
                {title}
            </Text>
            <MetroTouchable disabled={expanded || disabled}>
            <Animatable.View transition={["height"]} duration={150} className="mt-2 w-full pr-4 pl-6 py-2 text-base border-2 border-solid justify-center item-center overflow-hidden" style={
                expanded? {
                    backgroundColor: "white",
                    borderColor: toggleOnColor,
                    height: 45*(options.length)+20, //will probably edit
                }: {
                    height: 45, // probably edit too
                    borderColor: disabled? "gray": "white"
                }
                }>
                {options.map((option, index) => {
                    return (
                        <TouchableWithoutFeedback onPress={() => {
                            if (!disabled && !option.disabled) {
                                if (expanded) {
                                    setSelected(option);
                                    onChange(option);
                                    setExpanded(false)
                                } else {
                                    setExpanded(true)
                                }
                            }
                        }}>
                            <View style={(!expanded && option.value!==selected.value) && {
                                height: 0
                            }}>
                                <MetroTouchable disabled={!expanded || option.disabled} style={{ marginRight: "auto"}}>
                                    <Text className={`${expanded && "py-2"} -ml-3 text-lg`} style={[fonts.regular, {
                                        color: expanded? (option.value===selected.value? toggleOnColor: option.disabled? "gray": "black"): disabled? "gray": "white",
                                    }]}>
                                        {option.name}
                                    </Text>
                                </MetroTouchable>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })}
            </Animatable.View>
            </MetroTouchable>
        </View>
    )
};