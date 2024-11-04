import { View, Text, LayoutAnimation, Dimensions, FlatList, TouchableWithoutFeedback, ScrollView } from "react-native"
import * as Animatable from "react-native-animatable"
import { fonts } from "../../styles/fonts"
import { useState, useRef, useEffect, createContext, useContext } from "react"
import { useSharedValue } from "react-native-reanimated"
import { opacity } from "react-native-redash"

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
            contentContainerStyle={{
                height: SCREEN_HEIGHT
            }}
        >
            {data.map((item, index) => {
                return (
                    <expandedContext.Provider value={setExpandedIndex}>
                        <FlatListItem
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
                        </FlatListItem>
                    </expandedContext.Provider>
                )
            })}
        </ScrollView>
    );

        // return(
    //     <FlatList
    //         style={style}
    //         contentContainerStyle={{
    //             height: SCREEN_HEIGHT
    //         }}
    //         data={data}
            
    //         renderItem={({item, index}) => {
    //             return(
    //                 <FlatListItem
    //                     key={index}
    //                     options={item.context_options}
    //                     style={{
    //                         elevation: 2-index
    //                     }}
    //                 >
    //                     {renderItem({item, index})}
    //                 </FlatListItem>
    //             )
    //         }}
    //         {...props}
    //     />
    // )
}

const FlatListItem = ({
    options,
    children,
    style,
    index
}) => {
    const [hold, setHold] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [touchX, setTouchX] = useState(0);
    const [pressedIn, setPressedIn] = useState(false);

    const intervalRef = useRef();
    const holdTime = useSharedValue(0)

    const setExpandedIndex = useContext(expandedContext);

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
                    setExpandedIndex(index)
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
                zIndex: expanded? 10: 0
            }, style]}
        >
            <TouchableWithoutFeedback
                onPressIn={() => {setPressedIn(true)}}
                onLongPress={longPressHandler}
                onPressOut={pressOutHandler}
            >
                <View>
                    <Animatable.View
                        transition={"scale"}
                        duration={150}
                        style={{
                            transform: [
                                {
                                    scale: pressedIn && !(expanded || hold)? 0.975: 1
                                }
                            ]
                        }}
                    >
                        {children}
                    </Animatable.View>

                    <Animatable.View
                        transition={["left", "width"]}
                        duration={hold? 300: 1}
                        easing={"linear"}
                        style={{
                            position: "absolute",
                            paddingVertical: expanded? 10: 0,
                            backgroundColor: hold || expanded? "white": "black",
                            left: hold || expanded? 0: touchX,
                            width: hold || expanded? SCREEN_WIDTH: 0,
                            height: expanded? "auto": 2,
                            top: 65
                        }}
                    >
                        {options?.map((option, index) => {
                            return(
                                <TouchableWithoutFeedback
                                    onPress={() => {setExpanded(false); setExpandedIndex(-1)}}
                                >
                                    <Text className="text-2xl p-2" style={fonts.light}>
                                        {option.label}
                                    </Text>
                                </TouchableWithoutFeedback>
                            )
                        })}
                    </Animatable.View>
                </View>
            </TouchableWithoutFeedback>
        </Animatable.View>
    )
}

export default ContextFlatList;