import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import MetroTouchable from "./MetroTouchable";
import { View, Text, TouchableWithoutFeedback, Dimensions, LayoutAnimation} from "react-native";
import { useContext, useState, useRef, useEffect } from "react";
import { fonts } from "../../styles/fonts";
import { scaleContext } from "./MetroView";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");

const MetroContext = ({
    options,
    canTilt=true,
    onExpand,
    onDismissal,
    onPressIn,
    onPressOut,
    children,
    style,
    ...props
}) => {
    const [expanded, setExpanded] = useState(false);

    const holdProgress = useSharedValue(0);
    const holdInterval = useSharedValue();
    const touchX = useSharedValue(0);
    const [elementProps, setElementProps] = useState({
        height: 0,
        width: 0,
        x: 0,
        y: 0
    });

    const UIScale = useContext(scaleContext);
    const childRef = useRef();

    useEffect(() => {
        if (!expanded) {
            setTimeout(() => {
                holdProgress.value = 0;
            }, 150)
        }
    }, [expanded])

    const closeContext = () => {
        LayoutAnimation.configureNext({
            duration: 100,
            update: {type: "easeOut"}
        });
        setExpanded(false);
        const curUIScale = UIScale.value;
        let i = 1;
        clearInterval(holdInterval.value)
        holdInterval.value = setInterval(() => {
            i = Math.max(i-0.083, 0);
            UIScale.value = Math.min(interpolate(i,
                [1, 0.5, 0],
                [curUIScale, 1-(1-curUIScale)/5, 1]
            ), 1);
            if (i == 0) {
                clearInterval(holdInterval.value);
            }
        }, 16.66)
    }

    const onPressInTouchable = (e) => {
        if (!expanded) {
            childRef?.current.measure((x, y, width, height, pageX, pageY) => {
                setElementProps({
                    x: pageX,
                    y: pageY,
                    width: width,
                    height: height
                });
            });

            if (typeof onPressIn == "function") onPressIn();
        }
    }

    const onLongPress = (e) => {
        if (!expanded) {
            touchX.value = e.nativeEvent.locationX;

            clearInterval(holdInterval.value);
            holdInterval.value = setInterval(() => {
                holdProgress.value = Math.min(holdProgress.value+0.083, 1);
                UIScale.value = Math.max(UIScale.value-0.01/6, 0.98);
                if (holdProgress.value == 1) {
                    clearInterval(holdInterval?.value);
                    setExpanded(true);
                    if (typeof onPressOut == "function") onPressOut();
                    if (typeof onExpand == "function") onExpand();
                    let i = 0;
                    LayoutAnimation.configureNext({
                        duration: 100,
                        update: {type: "easeOut"}
                    });
                    holdInterval.value = setInterval(() => {
                        i = Math.min(i+0.055, 1);
                        UIScale.value = interpolate(i,
                            [0, 0.5, 1],
                            [0.98, 0.92, 0.9]
                        )
                        if (i == 1) {
                            clearInterval(holdInterval.value)
                        }
                    }, 16.66)
                }
            }, 16.66)
        }
    }

    const onPressOutTouchable = (e) => {
        if (!expanded) {
            clearInterval(holdInterval.value);
            holdProgress.value = 0;
            holdInterval.value = setInterval(() => {
                UIScale.value = Math.min(UIScale.value+0.1/12, 1);
                if (UIScale.value == 1) {
                    clearInterval(holdInterval.value);
                }
            });

            if (typeof onPressOut == "function") onPressOut();
        }
    }

    const scaleStyle = useAnimatedStyle(() => {
        return holdProgress.value != 0? {
            transform: [
                {
                    scale: 1 / UIScale.value
                },
                {
                    translateX: (1-UIScale.value)*(elementProps.x-SCREEN_WIDTH/2)+(1/UIScale.value-1)*(elementProps.width/2)
                },
                {
                    translateY: (1-UIScale.value)*(elementProps.y-SCREEN_HEIGHT/2)+(1/UIScale.value-1)*(elementProps.height/2)
                }
            ],
            zIndex: 10
        } : {
            transform: [
                {
                    scale: 1
                }
            ],
            zIndex: 0
        }
    });

    const contextMenuStyle = useAnimatedStyle(() => {
        return {
            width: holdProgress.value*SCREEN_WIDTH,
            left: interpolate(holdProgress.value,
                [0, 1],
                [touchX.value-elementProps.x, 0-elementProps.x]
            ),
        }
    })

    return(
        <Animated.View
            style={[scaleStyle, {
                zIndex: expanded? 10: 0
            }, style]}
            pointerEvents={"auto"}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    if (typeof onDismissal == "function") onDismissal();
                    closeContext();
                }}
            >
                <View
                    style={{
                        position: "absolute",
                        zIndex: -1, 
                        backgroundColor: "black",
                        opacity: 0.5,
                        left: 0,
                        top: 0,
                        height: SCREEN_HEIGHT+100,
                        width: SCREEN_WIDTH,
                        display: expanded? "flex": "none",
                        transform: [
                            {
                                translateY: -50-elementProps.y
                            }
                        ]
                    }}
                />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
                onPressIn={onPressInTouchable}
                onLongPress={onLongPress}
                onPressOut={onPressOutTouchable}
            >
                <Animated.View
                    ref={childRef}
                    //style={style}
                >
                <MetroTouchable
                    children={children}
                    //style={style}
                    {...props}
                    disabled={expanded}
                    canTilt = {canTilt}
                />
                </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.View
                style={[{
                    position: "absolute",
                    backgroundColor: "white",
                    paddingVertical: 14,
                    zIndex: 20
                }, contextMenuStyle, !expanded && {
                    height: 2,
                    paddingVertical: 0
                }, elementProps.y < SCREEN_HEIGHT/2? {
                    top: elementProps.height
                } : {
                    bottom: elementProps.height
                }]}
            >
                {options?.map((option, index) => {
                    return(
                        <MetroTouchable
                            style={{
                                marginVertical: 3,
                                paddingLeft: 10
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    closeContext();
                                    option.onPress && option.onPress()
                                }}
                            >
                                <Text
                                    style={[fonts.light]}
                                    className={"text-2xl"}
                                >
                                    {option.label}
                                </Text>
                            </TouchableWithoutFeedback>
                        </MetroTouchable>
                    );
                })}
            </Animated.View>
        </Animated.View>
    );
}

export default MetroContext;