import { View , StyleSheet, Text, Dimensions, TouchableWithoutFeedback, Linking } from "react-native"
import { AppTitle } from "../components/core/AppTitle"
import { FlatList } from "react-native-gesture-handler";
import { fonts } from "../styles/fonts";
import { ChevronUp, Delete, Save } from "react-native-feather";
import MetroTouchable from "../components/core/MetroTouchable";
import { useRef, useState } from "react";
import DTMFAssets from "../components/core/DTMFAssets";
import { Audio } from 'expo-av';
import { AsYouType } from "libphonenumber-js";
import MetroContext from "../components/core/MetroContext";
import * as Animatable from "react-native-animatable"
import MetroView from "../components/core/MetroView";
import { useSharedValue } from "react-native-reanimated";
import { Foundation } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const buttonData=[
    {
        index: 1,
        letters: "",
        DTMF: "1"
    },
    {
        index: 2,
        letters: "ABC",
        DTMF: "2"
    },
    {
        index: 3,
        letters: "DEF",
        DTMF: "3"
    },
    {
        index: 4,
        letters: "GHI",
        DTMF: "4"
    },
    {
        index: 5,
        letters: "JKL",
        DTMF: "5"
    },
    {
        index: 6,
        letters: "MNO",
        DTMF: "6"
    },
    {
        index: 7,
        letters: "PQRS",
        DTMF: "7"
    },
    {
        index: 8,
        letters: "TUV",
        DTMF: "8"
    },
    {
        index: 9,
        letters: "WXYZ",
        DTMF: "9"
    }
]

const ButtonItem = ({
    DTMF="",
    disabled=false,
    style,
    children,
    ...props
}) => {
    const [held, setHeld] = useState(false);
    const [sound, setSound] = useState(new Audio.Sound());

    const onLayout = async (e) => {
        if (DTMF.length!=0) {
            sound.loadAsync(DTMFAssets[`DTMF_${DTMF}`])
        }
    }

    const onPressIn = async (e) => {
        setHeld(true);

        if (DTMF.length!=0) {
            sound.playAsync()
            sound.setPositionAsync(0)
        }
    }

    const onPressOut = (e) => {
        setHeld(false);
    }

    return (
        <MetroTouchable
            onLayout={onLayout}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[{
                backgroundColor: !disabled && held? "#a013ec": "#383838",
            }, style]}
            yOffset={600}
        >
            {children}
        </MetroTouchable>
    )
}

const CallButton = ({
    number,
    sim,
    setSim
}) => {
    const [expanded, setExpanded] = useState(false);
    const callSIMWidth = useSharedValue(0)
    
    const callButtonSIMIn = {
        0: {
            transform: [
                {
                    translateY: 0
                },
                {
                    rotateX: "0deg"
                },
            ],
            width: callSIMWidth.value
        },
        0.5: {
            transform: [
                {
                    translateY: -30
                },
                {
                    rotateX: "90deg"
                }
            ],
            width: callSIMWidth.value
        },
        0.8: {
            transform: [
                {
                    translateY: -30
                },
                {
                    rotateX: "90deg"
                }
            ],
            width: callSIMWidth.value*0.25
        },
        1: {
            transform: [
                {
                    translateY: -30
                },
                {
                    rotateX: "90deg"
                }
            ],
            width: 0
        }
    }

    const callButtonSIMOut = {
        0: {
            transform: [
                {
                    translateY: -30
                },
                {
                    rotateX: "90deg"
                }
            ],
        },
        0.5: {
            transform: [
                {
                    translateY: 0
                },
                {
                    rotateX: "0deg"
                }
            ],
        },
        0.7: {
            transform: [
                {
                    translateY: -10
                },
                {
                    rotateX: "-30deg"
                }
            ]
        },
        1: {
            transform: [
                {
                    translateY: 0
                },
                {
                    rotateX: "0deg"
                }
            ]
        }
    }

    return (
        <MetroContext
            style={[{
                flex: 2.03,
            }]}
            options={[
                {
                    label: "SIM #1",
                    onPress: () => {
                        setExpanded(false);
                        setSim(0);
                    }
                },
                {
                    label: "SIM #2",
                    onPress: () => {
                        setExpanded(false);
                        setSim(1);
                    }
                }
            ]}
            onDismissal={() => { setExpanded(false) }}
            onExpand={() => {
                //console.log(callSIMWidth.value)

                setExpanded(true);
            }}
        >
            <View style={{
                aspectRatio: 3.25 / 1,
                width: "auto",
                backgroundColor: "#383838",
                flexDirection: "row"
            }}>
                <Text
                    style={[itemStyle.callButtonText, { marginLeft: "auto" }]}
                >
                    call
                </Text>
                <Animatable.View
                    style={{
                        marginRight: "auto",
                        flexDirection: "row",
                    }}
                    easing={"ease-in-out-sine"}
                    duration={expanded? 250: 450}
                    animation={expanded? callButtonSIMIn: callButtonSIMOut}
                    onLayout={(e) => { callSIMWidth.value = e.nativeEvent.layout.width }}
                >
                    <Text style={itemStyle.callButtonText}> SIM #{sim+1} </Text>
                    <ChevronUp stroke={"white"} width={25} style={{marginTop: "auto", marginBottom: "auto"}}/>
                </Animatable.View>
            </View>
        </MetroContext>
    )
}

const DialScreen = ({ navigation, route }) => {
    const [number, setNumber] = useState("");
    const deleteIntervalRef = useRef();
    const [zeroHeld, setZeroHeld] = useState(0);
    const [sim, setSim] = useState(0);
    const [callExpanded, setCallExpanded] = useState(false);

    const deletePressIn = () => {
        deleteIntervalRef.current = setInterval(() => {
            setNumber((number) => {
                if (number.length > 0) {
                    return number.slice(0, -1);
                } else {
                    clearInterval(deleteIntervalRef.current);
                    return number;
                }
            })
        }, 100);
    }

    const deletePressOut = () => {
        clearInterval(deleteIntervalRef.current);
    }

    const numButtonItem = ({item, index}) => {
        return(
            <ButtonItem
                style={itemStyle.numButton}
                DTMF={item.DTMF}
            >
                <TouchableWithoutFeedback
                    onPress={ () => { if (number.length <= 100) setNumber(number.concat(item.index)) }}
                    touchSoundDisabled={true}
                >
                    <View style={itemStyle.numButton}>
                        <Text style={[fonts.light, itemStyle.buttonLeadText]}>
                            {item.index}
                        </Text>
                        <Text style={[fonts.regular, itemStyle.buttonSubText]}>
                            {item.letters}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </ButtonItem>
        )
    }

    return (
        <MetroView>
        <View style={styles.container}>
            <AppTitle title="Fake GSM Network"/>
            <View style={styles.screenContainer}>
                <View style={styles.dialContainer}>
                    <Text 
                        numberOfLines={1}
                        ellipsizeMode="head"
                        style={[fonts.light, {
                            fontSize: 42,
                            marginRight: 45
                        }]}
                        className={"text-white mr-auto"}
                    >
                        { (number.match(/(#)|(\*)/)) || new AsYouType('US').input(number).length < number.length? number: new AsYouType('US').input(number) }
                    </Text>
                    <TouchableWithoutFeedback
                        delayPressIn={500}
                        onPressIn={deletePressIn}
                        onPressOut={deletePressOut}
                        onPress={ () => { if (number.length > 0) setNumber(number.slice(0, -1)) } }
                    >
                        <Delete width={40} height={40} stroke={"white"} strokeWidth={1} className={"mt-3"}
                            style={{
                                display: number.length!=0? "flex": "none",
                                marginLeft: "auto"
                            }}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.padContainer}>
                    <FlatList
                        numColumns={3}
                        data={buttonData}
                        renderItem={numButtonItem}
                        contentContainerStyle={{
                            gap: 3,
                        }}
                        columnWrapperStyle={{
                            gap: 3
                        }}
                        scrollEnabled={false}
                    />
                    <View style={itemStyle.buttonRow}>
                        <ButtonItem DTMF={"STAR"} style={itemStyle.numButton}>
                            <TouchableWithoutFeedback
                                onPress={ () => { if (number.length <= 100) setNumber(number.concat("*")) } }
                                touchSoundDisabled={true}
                            >
                                <View style={itemStyle.numButton}>
                                    <Text style={[fonts.light, itemStyle.charText, {fontSize: 50, marginTop: 12}]}>
                                        *
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </ButtonItem>
                        <ButtonItem
                            style={itemStyle.numButton}
                            DTMF={"0"}
                        >
                            <TouchableWithoutFeedback
                                delayPressIn={500}
                                onPressIn={() => {
                                    if (number.length <= 100) setNumber(number.concat("+"));
                                    setZeroHeld(true)
                                }}
                                onPress={() => { 
                                    if (!zeroHeld && number.length <= 100) setNumber(number.concat("0"));
                                    setZeroHeld(false)
                                }}
                                touchSoundDisabled={true}
                            >
                                <View style={itemStyle.numButton}>
                                    <Text style={[fonts.light, itemStyle.buttonLeadText]}>
                                        0
                                    </Text>
                                    <Text style={[fonts.regular, itemStyle.buttonSubText]}>
                                        +
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </ButtonItem>
                        <ButtonItem DTMF={"POUND"} style={itemStyle.numButton}>
                            <TouchableWithoutFeedback
                                touchSoundDisabled={true}
                                onPress={ () => { if (number.length <= 100) setNumber(number.concat("#")) } }
                            >
                                <View style={itemStyle.numButton}>
                                    <Text style={[fonts.light, itemStyle.charText]}>
                                        #
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </ButtonItem>
                    </View>
                    <View style={itemStyle.buttonRow}>
                        <CallButton number={number} sim={sim} setSim={setSim}/>
                        {/* </MetroContext> */}
                        <ButtonItem disabled={ number.length==0 } style={itemStyle.saveButton}>
                            <View style={itemStyle.saveButton}>
                                {/* <Save width={20} stroke={number.length!=0? "white": "#ffffff7f"} strokeWidth={2} className="ml-auto mr-auto mt-auto"/> */}
                                <Foundation name="save" size={20} color={number.length!=0? "white": "#ffffff7f"} style={{ marginLeft: "auto", marginRight: "auto", marginTop: "auto"}}/>
                                <Text
                                    style={[
                                        fonts.regular,
                                        { color: number.length != 0? "white": "#ffffff7f" }
                                    ]}
                                    className="text-lg text-white text-center mb-auto"
                                >
                                    save
                                </Text>
                            </View>
                        </ButtonItem>
                    </View>
                </View>
            </View>
        </View>
        </MetroView>
    )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 0, //120
      backgroundColor: "black"
    },
    screenContainer: {
        height: SCREEN_HEIGHT-20, // account for container padding top (120 original)
    },
    dialContainer: {
        marginBottom: "auto",
        flexDirection: "row",
        padding: 5,
        paddingTop: 15
    },
    padContainer: {
      backgroundColor: "#1f1f1f",
      height: "auto",
      paddingTop: 3
    
    },
    tabText: {
      paddingRight: 10,
      paddingLeft: 10,
      fontSize: 50,
    },
});

const itemStyle = StyleSheet.create({
    numButton: {
        flex: 1,
        flexDirection: "row",
        aspectRatio: 8/5
    },
    buttonLeadText: {
        flex: 1,
        color: "white",
        fontSize: 35,
        verticalAlign: "middle",
        textAlign: "right",
        marginRight: 5
    },
    buttonSubText: {
        flex: 1,
        color: "#ffffff7f",
        verticalAlign: "middle"
    },
    charText: {
        color: "white",
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 35,
        verticalAlign: "middle"
    },
    callButton: {
        flex: 2.03,
        verticalAlign: "middle"
    },
    callButtonText: {
        color: "white",
        fontSize: 20,

        marginTop: "auto",
        marginBottom: "auto"
    },
    buttonRow: {
        marginTop: 3,
        flexDirection: "row",
        gap: 3
    },
    saveButton: {
        flex: 1,
        flexDirection: "column",
        aspectRatio: 8/5,
    }
})

export default DialScreen;