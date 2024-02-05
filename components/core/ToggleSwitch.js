import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  Extrapolation,
  interpolateColor,
} from 'react-native-reanimated';

const BORDER_WIDTH = 3;

// This is a CONTROLLED component and state is stored by its parent.
// Parent can update the state in onToggle call back function

const ToggleSwitch = ({
  onToggle,
  isOn = false,
  toggleOffColor = 'black',
  toggleOnColor = 'orange',
  knobColor = '#c0c0c0ff',
  outerBorderColor = 'white',
  innerBorderColor = 'black',
  height = 25,
  width = 60,
}) => {
  const InterpolateXInput = [0, 1];
  const CONTAINER_WIDTH = width;
  const CONTAINER_HEIGHT = height;
  const KNOB_WIDTH = CONTAINER_WIDTH/3.5;
  const KNOB_HEIGHT = CONTAINER_HEIGHT + (2*BORDER_WIDTH);
  
  const sharedValue = useSharedValue(isOn ? 1 : 0);

  const containerScale = {
    height: CONTAINER_HEIGHT,
    width: CONTAINER_WIDTH,
  };
  const containerColors = {
    backgroundColor: toggleOffColor,
    borderColor: outerBorderColor,
  };

  const knobScale = {
    height: KNOB_HEIGHT,
    width: KNOB_WIDTH,
  };

  const knobColors = {
    backgroundColor: knobColor,
    borderColor: innerBorderColor,
  };

  useEffect(() => {
    animateSharedValue(isOn ? 1 : 0);
    // setToggled(isOn);
  }, [isOn])

  const onChangeToggle = () => {
    // const newState = !toggled;
    // setToggled(newState);
    // if (onToggle)
    //   onToggle(newState);
    if (onToggle)
      onToggle();
  };

  const animateSharedValue = (toValue) => {
    sharedValue.value = withTiming(toValue, {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
  }

  const onPressSwitch = () => {
    if (sharedValue.value === 0)
      animateSharedValue(1);
    else
      animateSharedValue(0);
    onChangeToggle();
  };

  const knobTranslateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            sharedValue.value,
            InterpolateXInput,
            [-BORDER_WIDTH, CONTAINER_WIDTH - KNOB_WIDTH],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const containerColorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(sharedValue.value, InterpolateXInput, [
        toggleOffColor,
        toggleOnColor,
      ]),
    };
  });

  return (
    <TouchableWithoutFeedback onPress={onPressSwitch}>
      <Animated.View style={[styles.containerStyle, containerScale, containerColors, containerColorStyle]}>
        <Animated.View style={{
          width: CONTAINER_WIDTH-(2*BORDER_WIDTH), height: CONTAINER_HEIGHT-(2*BORDER_WIDTH), 
          backgroundColor: '#ffffff00',
          borderWidth: BORDER_WIDTH,
          borderColor: innerBorderColor
          }}/>
        <Animated.View
          style={[styles.knobStyle, knobScale, knobTranslateStyle, knobColors]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    borderWidth: BORDER_WIDTH,
  },
  knobStyle: {
    position: 'absolute',
    borderWidth: BORDER_WIDTH,
  },
});

export default ToggleSwitch;

