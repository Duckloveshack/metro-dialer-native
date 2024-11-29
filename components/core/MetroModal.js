import { Modal, View, Text, StyleSheet, StatusBar } from "react-native"
import { fonts } from "../../styles/fonts";
import Button from "./Button";
import * as Animatable from 'react-native-animatable'
import { useEffect, useState } from "react";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { MetroTheme } from "../../styles/theme";

const MetroModal = ({
  buttons=[],
  title="Title",
  description="description", 
  visible=true
}) => {
  // const rotateIn = {
  //   0: {
  //     transform: [
  //       {
  //         rotateX: "90deg"
  //       }
  //     ]
  //   },
  //   1: {
  //     transform: [
  //       {
  //         rotateX: "0deg"
  //       }
  //     ]
  //   }
  // }
  // const rotateOut = {
  //   0: {
  //     transform: [
  //       {
  //         rotateX: "0deg"
  //       }
  //     ]
  //   },
  //   1: {
  //     transform: [
  //       {
  //         rotateX: "-90deg"
  //       }
  //     ]
  //   }
  // }

  const [onPress, setOnPress] = useState();
  const rotateCounter = useSharedValue(-1);
  const intervalRef = useSharedValue();

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateX: `${interpolate(rotateCounter.value,
            [-1, 0, 1],
            [90, 0, -90]
          )}deg`
        }
      ],
      opacity: rotateCounter.value > 0.95? 0: 1
    }
  })
  

  useEffect(() => { 
    if (typeof onPress == "function") setTimeout(onPress(), 1000);
  }, [onPress])

  useEffect(() => {
    if (visible) {
      rotateCounter.value=-1;
      intervalRef.value = setInterval(() => {
        rotateCounter.value+=0.16;
        if (rotateCounter.value >= 0) {
          rotateCounter.value=0;
          clearInterval(intervalRef.value); 
        }
      }, 10)
    }
  }, [visible])

    return(
        <Modal
          transparent={true}
          visible={visible}
          style={{
            backgroundColor: "black"
          }}
          statusBarTranslucent={true}
          collapsable={true}
        >
          <Animated.View
            style={[styles.container, rotationStyle]}
            // animation={disappear? rotateOut: rotateIn}
            duration={100}
            easing={"linear"}
          >
            <Text style={[fonts.regular, { color: MetroTheme.active }]} className="text-2xl">
              {title}
            </Text>
            <Text style={[fonts.regular, { color: MetroTheme.active }]} className="text-base text-white my-6">
              {description}
            </Text>
            <View className="flex-row gap-2">
              {buttons.map((button, index) => {
                return(
                  <Button text={button.label} style={{flex: 1}} onPress={(e) => {
                    clearInterval(intervalRef.value)
                    intervalRef.value = setInterval(() => {
                      rotateCounter.value+=0.16;
                      if (rotateCounter.value >= 1) {
                        rotateCounter.value=-1;
                        clearInterval(intervalRef.value);
                        if (button.onPress) button.onPress();
                      }
                    }, 10)
                  }}/>
                )
              })}
            </View>
          </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight+15,
    //marginTop: -StatusBar.currentHeight,
    padding: 15,
    backgroundColor: MetroTheme.menu,
    position: "absolute",
    zIndex: 99,
    width: "100%",
    top: 0
  }
});

export default MetroModal;