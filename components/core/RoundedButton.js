import { View, Text, TouchableWithoutFeedback } from "react-native";
import * as Animatable from "react-native-animatable"
import { MetroTheme } from "../../styles/theme";

const RoundedButton = ({ classOverrides = "", Icon, action, disabled=false, bounce=false, disappear=false }) => {
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
        className={`rounded-full border-2 h-9 w-9 flex items-center justify-center ${classOverrides}`} style={{ borderColor: disabled? MetroTheme.inactive: MetroTheme.active}}
      >
        {Icon}
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

export default RoundedButton;