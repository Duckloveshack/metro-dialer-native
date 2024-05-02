import { Text, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, View } from "react-native"
import { fonts } from "../../styles/fonts"

const Button = ({
  text, 
  onPress, 
  disabled = false, 
  classOverride = "", 
  isLowerCase = true
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View className={`w-fit flex items-center justify-center border-2 border-solid ${disabled ? "border-gray-600" : "border-white"} py-2 px-4 ${classOverride}`}>
        <Text className={`${disabled ? "text-gray-600" : "text-white"} text-base ${isLowerCase && "lowercase"}`} style={fonts.regular}>
          {text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Button;