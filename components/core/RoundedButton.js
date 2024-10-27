import { View, Text, TouchableWithoutFeedback } from "react-native";
import * as Animatable from "react-native-animatable"

const RoundedButton = ({ classOverrides = "", Icon, action, disabled=fals, bounce }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        action();
      }}
    >
      <Animatable.View easing={"ease-out-back"} duration={bounce? 300: 1} animation="fadeInUp"
        className={`rounded-full border-2 h-9 w-9 flex items-center justify-center ${
          disabled ? "border-[#8a8a8a]" : "border-white"
        } ${classOverrides}`}
      >
        {/* <Copy  width={20} stroke={"white"}/> */}
        {Icon}
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

export default RoundedButton;