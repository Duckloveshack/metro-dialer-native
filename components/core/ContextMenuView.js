import { useRef, useState } from "react";
import { TouchableWithoutFeedback, View, Text, StyleSheet, Dimensions } from "react-native";
import { interpolate, useSharedValue } from "react-native-reanimated";
import * as Animatable from "react-native-animatable"
import { fonts } from "../../styles/fonts";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const ContextMenuView = ({
    options,
    children,
    ...props
}) => {
    const [hold, setHold] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [touchX, setTouchX] = useState(0);

    const intervalRef = useRef();
    const holdTime = useSharedValue(0);

    return(
        <TouchableWithoutFeedback onLongPress={(e) => {
            if (!expanded) {
                setTouchX(e.nativeEvent.locationX)
                setHold(true)
                            
                intervalRef.current = setInterval(() => {
                    holdTime.value+=50;
                    if (holdTime.value == 500) {
                        setExpanded(true);
                        setHold(false);
                        console.log("set expanded");
                        clearInterval(intervalRef.current)
                    }
                }, 50)
            }
        }} onPressOut={() => {
            clearInterval(intervalRef.current);
            holdTime.value=0;
            setHold(false)
        }}>
            <View className="flex flex-col">
                <View style={{elevation: 0}}>
                    <View {...props}>
                        {children}
                    </View>
                </View>
                <View className="flex-1" style={{elevation: 2}}>
                    <Animatable.View easing={"linear"} transition={["left", "width", "height"]} duration={hold? 500: 1} style={{
                        paddingVertical: expanded? 8: 0,
                        left: hold || expanded? 0: touchX,
                        width: hold || expanded? SCREEN_WIDTH: 0,
                        backgroundColor: hold || expanded? "white": "black",
                        height: expanded? options.length*48+16: 2,
                        elevation: 10
                    }}>
                        {options.map((option, index) => {
                            return(
                                <View key={index}>
                                    <TouchableWithoutFeedback onPress={() => {setExpanded(false)}}>
                                        <Text className={`text-2xl z-10 ${expanded && "p-2"} pl-4`} style={fonts.light}>{option.label}</Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        })}
                </Animatable.View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    }
})

export default ContextMenuView;