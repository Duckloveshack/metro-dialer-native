import { View, Text, LayoutAnimation, Dimensions, FlatList, TouchableWithoutFeedback, ScrollView } from "react-native"
import * as Animatable from "react-native-animatable"
import { fonts } from "../../styles/fonts"
import { useState, useRef, useEffect, createContext, useContext } from "react"
import { useSharedValue } from "react-native-reanimated"
import { opacity } from "react-native-redash"
import MetroTouchable from "./MetroTouchable"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const expandedContext = createContext(() => {})

const ContextFlatList = ({
    data, renderItem=() => {},
    style,
    ...props
}) => {
    const [expandedIndex, setExpandedIndex] = useState(-1)

    return(
        <ScrollView
            scrollEnabled={true}
        >
            {data.map((item, index) => {
                return (
                    <expandedContext.Provider value={setExpandedIndex}>
                        <MetroContext
                            key={index}
                            index={index}
                            options={item.context_options}
                            style={{
                                opacity: (expandedIndex!=-1 && index!=expandedIndex)? 0.5: 1,
                                transform: [
                                    {
                                        scale: (expandedIndex!=-1 && index!=expandedIndex)? 0.95: 1
                                    }
                                ]
                            }}
                        >
                            {renderItem({item, index})}
                        </MetroContext>
                    </expandedContext.Provider>
                )
            })}
        </ScrollView>
    );
}

const MetroContext = ({
    options,
    children,
    style,
    index
}) => {
    const [hold, setHold] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [touchX, setTouchX] = useState(0);
    const [pressedIn, setPressedIn] = useState(false);
    const [isDown, setIsDown] = useState(true);

    const intervalRef = useRef();
    const viewRef = useRef();
    const holdTime = useSharedValue(0);
    const elementHeight = useSharedValue(0);

    const setExpandedIndex = useContext(expandedContext);

    const pressInHandler = (e) => {
        setPressedIn(true);
        viewRef?.current.measure((x, y, width, height, pageX, pageY) => {
            if (pageY/SCREEN_HEIGHT >= 0.5) {
                setIsDown(false);
            } else {
                setIsDown(true);
            }
            elementHeight.value=height;
        })
    }

    const longPressHandler = (e) => {
        if (!expanded) {
            setPressedIn(false)
            setTouchX(e.nativeEvent.locationX);
            setHold(true);

            intervalRef.current = setInterval(() => {
                holdTime.value+=50;
                if (holdTime.value == 300) {
                    setExpanded(true);
                    setHold(false);
                    setExpandedIndex(index);

                    LayoutAnimation.configureNext({
                        duration: 100,
                        update: {type: "easeOut"}
                    })
                    clearInterval(intervalRef.current);
                }
            }, 50)
        }
    }

    const pressOutHandler = () => {
        setHold(false);
        holdTime.value = 0;
        clearInterval(intervalRef.current);
        setPressedIn(false);
    }
    return(
        <Animatable.View
            transition={["opacity", "scale"]}
            style={[{
                zIndex: expanded? 10: 0,
            }, style]}
        >
            <TouchableWithoutFeedback
                onPressIn={pressInHandler}
                onLongPress={longPressHandler}
                onPressOut={pressOutHandler}
            >
                <View
                    ref={viewRef}
                >
                    <Animatable.View
                        transition={"scale"}
                        duration={150}
                        style={{
                            transform: [
                                {
                                    scale: pressedIn && !(expanded || hold)? 0.975: 1
                                }
                            ],
                            position: "relative"
                        }}
                    >
                        <MetroTouchable disabled={expanded}>
                            {children}
                        </MetroTouchable>
                    </Animatable.View>

                    <Animatable.View
                        transition={["left", "width"]}
                        duration={hold? 300: 1}
                        easing={"linear"}
                        style={[{
                            position: "absolute",
                            paddingVertical: expanded? 10: 0,
                            backgroundColor: hold || expanded? "white": "black",
                            left: hold || expanded? 0: touchX,
                            width: hold || expanded? SCREEN_WIDTH: 0,
                            height: expanded? "auto": 2,
                        }, isDown? {
                            top: elementHeight.value-5
                        }: {
                            bottom: elementHeight.value+3
                        }]}
                    >
                        {options?.map((option, index) => {
                            return(
                                <MetroTouchable>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setExpanded(false);
                                        setExpandedIndex(-1);
                                        if (option.onPress) option.onPress();
                                    }}
                                >
                                    <Text className="text-2xl p-2 pl-4" style={fonts.light}>
                                        {option.label}
                                    </Text>
                                </TouchableWithoutFeedback>
                                </MetroTouchable>
                            )
                        })}
                    </Animatable.View>
                </View>
            </TouchableWithoutFeedback>
        </Animatable.View>
    )
}

export default ContextFlatList;

export { MetroContext }