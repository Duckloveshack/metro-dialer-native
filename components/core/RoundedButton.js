import { Foundation } from "@expo/vector-icons";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import * as Animatable from "react-native-animatable"

const RoundedButton = ({ classOverrides = "", icon="x", Icon, action, disabled=false, bounce=false, disappear=false }) => {
  const fadeOutUpCustom = {
    0: {
      translateY: 0,
      opacity: 1
    }, 
    1: {
      translateY: -30,
      opacity: 0
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        action();
      }}
    >
      <Animatable.View easing={disappear? "ease-in": "ease-out-back"} duration={disappear? 150: (bounce? 300: 1)} animation={disappear? fadeOutUpCustom: "fadeInUp"}
        className={`rounded-full border-2 h-9 w-9 flex items-center justify-center ${
          disabled ? "border-[#8a8a8a]" : "border-white"
        } ${classOverrides}`}
      >
        {/* <Copy  width={20} stroke={"white"}/> */}
        {Icon? Icon: <Foundation name={icon} size={20} color={"white"}/>}
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

export default RoundedButton;