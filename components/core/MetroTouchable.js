import { useRef, useState } from "react"
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";

const { View, TouchableWithoutFeedback } = require("react-native")

const MetroTouchable = ({
    children,
    onPressIn, onPressOut,
    style,
    disabled=false,
    xOffset=0, yOffset=0,
    intensityX=20, intensityY=20,
    transformStyle,
    ...props
}) => {
    
    //const pressed = useSharedValue(false);
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);

    const containerX = useSharedValue(0);
    const containerY = useSharedValue(0);
    const containerWidth = useSharedValue(0);
    const containerHeight = useSharedValue(0);

    const viewRef = useRef();

    const onLayout = (e) => {
        containerWidth.value = e.nativeEvent.layout.width;
        containerHeight.value = e.nativeEvent.layout.height;

        viewRef?.current.measure((x, y, width, height, pageX, pageY) => {
            containerX.value = pageX-xOffset;
            containerY.value = pageY-yOffset;
        });
    }

    const onTouchStart = (e) => {
        if (onPressIn) onPressIn(e);
        onTouchMove(e);
    }

    const onTouchMove = (e) => {
        if (!disabled) {
            const { width, height, pageX, pageY } = e.nativeEvent

            const offsetX = Math.max(Math.min(pageX-containerX.value, containerWidth.value), 0) - containerWidth.value/2;
            const offsetY = Math.max(Math.min(pageY-containerY.value, containerHeight.value), 0) - containerHeight.value/2;

            rotateX.value = -offsetY/containerHeight.value*intensityX
            rotateY.value = offsetX/containerWidth.value*intensityY
        }
    }

    const onTouchEnd = (e) => {
        rotateX.value = 0;
        rotateY.value = 0;

        if (onPressOut) onPressOut(e)
    }

    const touchedStyle = useAnimatedStyle(() => {
        if (transformStyle) {
            return {
                transform: [
                    ...transformStyle,
                    {
                        rotateX: `${rotateX.value}deg`
                    },
                    {
                        rotateY: `${rotateY.value}deg`
                    }
                ]
            }
        } else {
            return {
                transform: [
                    {
                        rotateX: `${rotateX.value}deg`
                    },
                    {
                        rotateY: `${rotateY.value}deg`
                    }
                ]
            }
        }

    })

    return(
        <Animated.View
            onLayout={onLayout}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}

            ref={viewRef}

            style={[touchedStyle, style]}
        >
            {/* <TouchableWithoutFeedback onPress={onPress}> */}
                {children}
            {/* </TouchableWithoutFeedback> */}
        </Animated.View>
    )
}

export default MetroTouchable