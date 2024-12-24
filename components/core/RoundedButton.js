import { Foundation } from "@expo/vector-icons";
import { act, useRef, useState } from "react";
import { View, Text, TouchableWithoutFeedback, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable"
import { useSharedValue } from "react-native-reanimated";
import { opacity } from "react-native-redash";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const RoundedButton = ({ classOverrides = "", icon="x", Icon, action, disabled=false, bounce=false, disappear=false }) => {
  const [held, setHeld] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  const ref = useRef();

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

  const onPressIn = (e) => {
    if (!disabled) {
      e.preventDefault();
      e.stopPropagation();
      
      ref.current.measure((x, y, width, height, pageX, pageY) => {
        setPosition({
          x: pageX,
          y: pageY
        });
      });

      setHeld(true);
    }
  }

  return (
    <View
      onStartShouldSetResponder={(event) => true}
      ref={ref}
    >
      <TouchableWithoutFeedback
        onPress={() => { if ( typeof action == "function" ) action(); }}
        onPressIn={onPressIn}
        onPressOut={() => {setHeld(false)}}
      >
        <Animatable.View easing={disappear? "ease-in": "ease-out-back"} duration={disappear? 150: (bounce? 350: 1)} animation={disappear? fadeOutUp: fadeInUp}>
          <Animatable.View
            className={`rounded-full border-2 h-9 w-9 flex overflow-hidden ${
              disabled ? "border-[#8a8a8a]" : "border-white"
            } ${classOverrides}`}
            style={{
              backgroundColor: held? "#a013ec": "#ffffff00",
              justifyContent: "center",
              alignItems: "center",
              transform: [
                {
                  translateY: held? ((SCREEN_HEIGHT/2) - position.y) / SCREEN_HEIGHT * 5: 0
                },
                {
                  translateX: held? ((SCREEN_WIDTH/2) - position.x) / SCREEN_WIDTH * 5 : 0
                }
              ]
            }}
            transition={["translateY", "translateX"]}
            duration={100}
          >
            {Icon? Icon: <Foundation name={icon} size={20} color={disabled? "#8a8a8a": "white"}/>}
          </Animatable.View>
        </Animatable.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default RoundedButton;