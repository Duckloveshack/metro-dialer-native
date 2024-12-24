import { useRef, useState } from "react"
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";

const { View, TouchableWithoutFeedback, Dimensions } = require("react-native")

const MetroTouchable = ({
    children,
    onPressIn, onPressOut,
    onLayout,
    style,
    disabled=false,
    canTilt=true,
    // xOffset=0, yOffset=0,
    intensityX=15, intensityY=15,
    transformStyle,
    ...props
}) => {
    
    //const pressed = useSharedValue(false);
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const containerX = useSharedValue(0);
    const containerY = useSharedValue(0);
    const containerWidth = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const holdInterval = useRef();

    const viewRef = useRef();

    const onLayoutRoot = (e) => {
        containerWidth.value = e.nativeEvent.layout.width;
        containerHeight.value = e.nativeEvent.layout.height;

        if (onLayout) onLayout(e);
    }

    const onTouchStart = (e) => {
        viewRef?.current.measure((x, y, width, height, pageX, pageY) => {
            containerX.value = pageX//-xOffset;
            containerY.value = pageY//-yOffset;
        });

        if (onPressIn) onPressIn(e);
        onTouchMove(e);

        clearInterval(holdInterval.current);
        if (!disabled) {
            holdInterval.current = setInterval(() => {
                scale.value = Math.max(scale.value-0.02, 0.95)
                if (scale.value == 0.95) {
                    clearInterval(holdInterval);
                }
            }, 16.66)
        }
    }

    const onTouchMove = (e) => {
        if (!disabled && canTilt) {

            const { pageX, pageY } = e.nativeEvent

            // const elementCenterX = containerX.value+containerWidth.value/2;
            // const elementCenterY = containerY.value+containerHeight.value/2;

            // const distance = Math.hypot(pageX-elementCenterX, pageY-elementCenterY)

            // const distX = (pageX-elementCenterX);
            // const distY = (pageY-elementCenterY)
            // console.log(distX)

            // rotateY.value = Math.atan2(distX, distY) * (180/Math.PI);
            // rotateX.value = (distance / 250) * (180/Math.PI)
            const offsetX = Math.max(Math.min(pageX-containerX.value, containerWidth.value), 0) - containerWidth.value/2;
            const offsetY = Math.max(Math.min(pageY-containerY.value, containerHeight.value), 0) - containerHeight.value/2;

            rotateX.value = -offsetY/containerHeight.value*intensityX
            rotateY.value = offsetX/containerWidth.value*intensityY
        }
    }

    const onTouchEnd = (e) => {
        rotateX.value = 0;
        rotateY.value = 0;

        clearInterval(holdInterval.current);
        holdInterval.current = setInterval(() => {
            scale.value = Math.min(scale.value+0.02, 1)
            if (scale.value == 1) {
                clearInterval(holdInterval);
            }
        })

        if (onPressOut) onPressOut(e);
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
                    },
                    {
                        scale: scale.value
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
                    },
                    {
                        scale: scale.value
                    }
                ]
            }
        }

    })

    return(
        <Animated.View
            onLayout={onLayoutRoot}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}

            ref={viewRef}

            style={[touchedStyle, style]}

            {...props}
        >
            {/* <TouchableWithoutFeedback onPress={onPress}> */}
                {children}
            {/* </TouchableWithoutFeedback> */}
        </Animated.View>
    )
}

export default MetroTouchable

// import { useRef, useState } from "react"
// import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
// import Animated from "react-native-reanimated";
// import * as Animatable from "react-native-animatable";

// const { View, TouchableWithoutFeedback, Dimensions } = require("react-native")

// const MetroTouchable = ({
//     children,
//     onPressIn, onPressOut,
//     onLayout,
//     style,
//     upperStyle,
//     disabled=false,
//     // xOffset=0, yOffset=0,
//     intensityX=15, intensityY=15,
//     transformStyle,
//     ...props
// }) => {
    
//     //const pressed = useSharedValue(false);
//     const rotateX = useSharedValue(0);
//     const rotateY = useSharedValue(0);
//     const [held, setHeld] = useState(false);

//     const containerX = useSharedValue(0);
//     const containerY = useSharedValue(0);
//     const containerWidth = useSharedValue(0);
//     const containerHeight = useSharedValue(0);

//     const viewRef = useRef();

//     const onLayoutRoot = (e) => {
//         containerWidth.value = e.nativeEvent.layout.width;
//         containerHeight.value = e.nativeEvent.layout.height;

//         if (onLayout) onLayout(e);
//     }

//     const onTouchStart = (e) => {
//         if (!disabled) {
//             viewRef?.current.measure((x, y, width, height, pageX, pageY) => {
//                 containerX.value = pageX//-xOffset;
//                 containerY.value = pageY//-yOffset;
//             });

//             onTouchMove(e);
//             setHeld(true);
//         }

//         if (onPressIn) onPressIn(e);
//     }

//     const onTouchMove = (e) => {
//         if (!disabled) {

//             const { pageX, pageY } = e.nativeEvent

//             // const elementCenterX = containerX.value+containerWidth.value/2;
//             // const elementCenterY = containerY.value+containerHeight.value/2;

//             // const distance = Math.hypot(pageX-elementCenterX, pageY-elementCenterY)

//             // const distX = (pageX-elementCenterX);
//             // const distY = (pageY-elementCenterY)
//             // console.log(distX)

//             // rotateY.value = Math.atan2(distX, distY) * (180/Math.PI);
//             // rotateX.value = (distance / 250) * (180/Math.PI)
//             const offsetX = Math.max(Math.min(pageX-containerX.value, containerWidth.value), 0) - containerWidth.value/2;
//             const offsetY = Math.max(Math.min(pageY-containerY.value, containerHeight.value), 0) - containerHeight.value/2;

//             rotateX.value = -offsetY/containerHeight.value*intensityX
//             rotateY.value = offsetX/containerWidth.value*intensityY
//         }
//     }

//     const onTouchEnd = (e) => {
//         rotateX.value = 0;
//         rotateY.value = 0;

//         setHeld(false);

//         if (onPressOut) onPressOut(e);
//     }

//     const touchedStyle = useAnimatedStyle(() => {
//         if (transformStyle) {
//             return {
//                 transform: [
//                     ...transformStyle,
//                     {
//                         rotateX: `${rotateX.value}deg`
//                     },
//                     {
//                         rotateY: `${rotateY.value}deg`
//                     }
//                 ]
//             }
//         } else {
//             return {
//                 transform: [
//                     {
//                         rotateX: `${rotateX.value}deg`
//                     },
//                     {
//                         rotateY: `${rotateY.value}deg`
//                     }
//                 ]
//             }
//         }

//     })

//     return(
//         <Animated.View
//             onLayout={onLayoutRoot}
//             onTouchStart={onTouchStart}
//             onTouchMove={onTouchMove}
//             onTouchEnd={onTouchEnd}
//             onTouchCancel={onTouchEnd}

//             ref={viewRef}

//             style={[touchedStyle, upperStyle]}

//             {...props}
//         >
//             <Animatable.View transition={"scale"} duration={100} style={[{
//                 transform: [
//                     {
//                         scale: held? 0.95: 1
//                     }
//                 ]
//             }, style]}>
//                 {children}
//             </Animatable.View>
//         </Animated.View>
//     )
// }

// export default MetroTouchable