import { createContext } from "react";
import { View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export const scaleContext = createContext();

const MetroView = ({
    style,
    children,
    ...props
}) => {
    const UIScale = useSharedValue(1);

    const scaleStyle = useAnimatedStyle(() => {
        return({
            transform: [
                {
                    scale: UIScale.value
                }
            ]
        })
    });

    return(
        <scaleContext.Provider value={UIScale}>
            <Animated.View style={[scaleStyle, style]} children={children}>
            </Animated.View>
        </scaleContext.Provider>
    )
}

export default MetroView;