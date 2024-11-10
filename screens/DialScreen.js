import { View , StyleSheet, Text, Dimensions, TouchableWithoutFeedback, Linking } from "react-native"
import { AppTitle } from "../components/core/AppTitle"
import { FlatList } from "react-native-gesture-handler";
import { fonts } from "../styles/fonts";
import { Delete, Save } from "react-native-feather";
import MetroTouchable from "../components/core/MetroTouchable";
import { useState } from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const buttonData=[
    {
        index: 1,
        letters: ""
    },
    {
        index: 2,
        letters: "ABC"
    },
    {
        index: 3,
        letters: "DEF"
    },
    {
        index: 4,
        letters: "GHI"
    },
    {
        index: 5,
        letters: "JKL"
    },
    {
        index: 6,
        letters: "MNO"
    },
    {
        index: 7,
        letters: "PQRS"
    },
    {
        index: 8,
        letters: "TUV"
    },
    {
        index: 9,
        letters: "WXYZ"
    }
]

const ButtonItem = ({
    disabled=false,
    style,
    children,
    ...props
}) => {
    const [held, setHeld] = useState(false);

    const onPressIn = (e) => {
        setHeld(true);
    }

    const onPressOut = (e) => {
        setHeld(false);
    }

    return (
        <MetroTouchable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[{
                backgroundColor: !disabled && held? "#a013ec": "#383838",
            }, style]}
            transformStyle={[
                {
                    scale: held? 0.95: 1
                },
                {
                    translateY: held? -2: 0
                }
            ]}
            yOffset={600}
        >
            {children}
        </MetroTouchable>
    )
}

const DialScreen = ({ navigation, route }) => {
    const [number, setNumber] = useState("");

    const numButtonItem = ({item, index}) => {
        return(
            <ButtonItem style={itemStyle.numButton}>
                <TouchableWithoutFeedback
                    onPress={ () => { setNumber(number.concat(item.index)) } }
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
        <View style={styles.container}>
            <AppTitle title="Fake GSM Network"/>
            <View style={styles.screenContainer}>
                <View style={styles.dialContainer}>
                    <Text 
                        numberOfLines={1}
                        ellipsizeMode="head"
                        style={[fonts.light, {
                            fontSize: 45,
                            marginRight: 45
                        }]}
                        className={"text-white mr-auto"}
                    >
                        {number}
                    </Text>
                    <TouchableWithoutFeedback
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
                        <ButtonItem style={itemStyle.numButton}>
                            <TouchableWithoutFeedback
                                onPress={ () => { setNumber(number.concat("*")) } }
                            >
                                <View style={itemStyle.numButton}>
                                    <Text style={[fonts.light, itemStyle.charText, {fontSize: 50, marginTop: 12}]}>
                                        *
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </ButtonItem>
                        {numButtonItem({item: {
                            index: 0,
                            letters: "+"
                        }})}
                        <ButtonItem style={itemStyle.numButton}>
                            <TouchableWithoutFeedback
                                onPress={ () => { setNumber(number.concat("#")) } }
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
                        <ButtonItem disabled={ number.length==0 } style={itemStyle.callButton}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    if (number.length != 0) {
                                        Linking.openURL(`tel:${number}`);
                                    }
                                }}
                            >
                                <View style={itemStyle.callButton}>
                                    <Text style={[fonts.regular, itemStyle.callButtonText, {
                                        color: number.length != 0? "white": "#ffffff7f"
                                    }]}>
                                        call
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </ButtonItem>
                        <ButtonItem disabled={ number.length==0 } style={itemStyle.saveButton}>
                            <View style={itemStyle.saveButton}>
                                <Save width={20} stroke={number.length!=0? "white": "#ffffff7f"} strokeWidth={2} className="ml-auto mr-auto mt-auto"/>
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
        textAlign: "center",
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