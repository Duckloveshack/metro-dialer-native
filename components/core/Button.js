import { Text, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, View } from "react-native"
import { fonts } from "../../styles/fonts"
import MetroTouchable from "./MetroTouchable";
import { useState } from "react";

const Button = ({
  text, 
  onPress, 
  disabled = false, 
  classOverride = "", 
  isLowerCase = true,
  style
}) => {
  const [held, setHeld] = useState(false);

  return (
    <MetroTouchable
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) setHeld(true)
      }}
      onPressOut={() => {
        setHeld(false)
      }}
      style={style}
      className={held? `bg-[#a013ec]`: ""}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <View className={`flex items-center border-2 border-solid ${disabled ? "border-gray-600" : "border-white"} py-1.5 px-4 ${classOverride}`}>
          <Text className={`${disabled ? "text-gray-600" : "text-white"} text-lg ${isLowerCase && "lowercase"}`} style={fonts.regular}>
            {text}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </MetroTouchable>
  )
}

export default Button;