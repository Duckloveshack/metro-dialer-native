import { Foundation } from "@expo/vector-icons";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import * as Animatable from "react-native-animatable"
import { opacity } from "react-native-redash";

const RoundedButton = ({ classOverrides = "", icon="x", Icon, action, disabled=false, bounce=false, disappear=false }) => {
  const fadeInUp = {
    0: {
      translateY: 100
    },
    0.5: {
      translateY: 100
    },
    0.80: {
      translateY: 15
    },
    1: {
      translateY: 0,
    }
  }
  const fadeOutUp = {
    0: {
      translateY: 0,
    }, 
    1: {
      translateY: -100,
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        action();
      }}
    >
      <Animatable.View easing={disappear? "ease-in": "ease-out-back"} duration={disappear? 150: (bounce? 350: 1)} animation={disappear? fadeOutUp: fadeInUp}
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