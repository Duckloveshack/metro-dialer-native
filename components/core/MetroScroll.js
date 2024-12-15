import { View, Dimensions } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { ReduceMotion, useAnimatedReaction, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withDecay, withClamp, withSpring, runOnJS } from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { useEffect } from "react";

const SIZE = 60;
const BOUNDARY_OFFSET = 0;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");

const MetroScroll = ({
    data,
    renderItem=(item, index) => {},
    ...props
}) => {
    const translateY = useSharedValue(0);
    const height = useSharedValue(0);
    const rootHeight = useSharedValue(0);

    const onLayoutRoot = ((e) => {
        rootHeight.value = e.nativeEvent.layout.height;
        console.log(`rootHeight: ${e.nativeEvent.layout.height}`);

        pan.enabled(e.nativeEvent.layout.height < height.value);
    })

    const onLayout = ((e) => {
        height.value = e.nativeEvent.layout.height;
        //translateY.value = -e.nativeEvent.layout.height;

        console.log(`height: ${e.nativeEvent.layout.height}`);

        pan.enabled(e.nativeEvent.layout.height > rootHeight.value)
    })

    const handleBoundarySnap = () => {
        console.log("a")
        translateY.value = withSpring(
            Math.min(Math.max(translateY.value, rootHeight.value-height.value), 0),
            { stiffness: 90, damping: 10}
        )
    }

    const pan = Gesture.Pan()
        .enabled(height.value > rootHeight.value)
        .maxPointers(1)
        .activeOffsetY([-20, 20])
        .onChange((event) => {
            translateY.value = Math.max(Math.min(translateY.value+event.changeY, height.value/data.length*1), rootHeight.value-height.value-height.value/data.length*1);
        })
        .onFinalize((event) => {
            translateY.value = withDecay({
                velocity: event.velocityY,
                reduceMotion: ReduceMotion.System,
                clamp: [rootHeight.value-height.value, 0],
                rubberBandEffect: true,
                rubberBandFactor: 0.5
            }, (finished) => {
                if (translateY.value < height.value/data.length*1 || translateY.value > rootHeight.value-height.value-height.value/data.length*1) {
                    translateY.value = withSpring(
                        Math.min(Math.max(translateY.value, rootHeight.value-height.value), 0),
                        { stiffness: 90, damping: 10}
                    )
                }
            })
        })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: translateY.value
                }
            ],
            
        }
    });

    const childrenStyle = useAnimatedStyle(() => {
        return {
            padding: 0
        }
    });

    const AnimatedMaskedView = Animated.createAnimatedComponent(MaskedView)

    return(
        <MaskedView
            style={{overflow: "visible", width: "100%"}}
            maskElement={<View style={{height: "100%", width: "200%", backgroundColor: "white", borderColor: "white", position: "absolute", overflow: "visible"}}/>}
        >
        <GestureHandlerRootView onLayout={onLayoutRoot} style={{
            height: "100%",
        }}>
            <View onLayout={onLayout}>
                <GestureDetector gesture={pan}>
                    <Animated.View
                        style={[animatedStyle]}
                        {...props}
                    >
                        {(typeof renderItem == "function" && Array.isArray(data)) && data.map((item, index) => {
                            return (
                                // <Animated.View style={childrenStyle}>
                                //     {renderItem({item: item, index: index})}
                                // </Animated.View>
                                renderItem({item: item, index: index})
                            )
                        })}
                    </Animated.View>
                </GestureDetector>
            </View>
        </GestureHandlerRootView>
        </MaskedView>
    )
}

export default MetroScroll;