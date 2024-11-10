import { View , StyleSheet, Text, Dimensions } from "react-native"
import { AppTitle } from "../components/core/AppTitle"
import { FlatList } from "react-native-gesture-handler";
import { fonts } from "../styles/fonts";
import { Delete, Save } from "react-native-feather";
import MetroTouchable from "../components/core/MetroTouchable";

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

const DialScreen = ({ navigation, route }) => {
    const buttonItem = ({item, index}) => {
        return(
            <MetroTouchable style={itemStyle.numButton} yOffset={600}>
                <View style={itemStyle.numButton}>
                    <Text style={[fonts.light, itemStyle.buttonLeadText]}>
                        {item.index}
                    </Text>
                    <Text style={[fonts.regular, itemStyle.buttonSubText]}>
                        {item.letters}
                    </Text>
                </View>
            </MetroTouchable>
        )
    }

    return (
        <View style={styles.container}>
            <AppTitle title="Fake GSM Network"/>
            <View style={styles.screenContainer}>
                <View style={styles.dialContainer}>
                    <Text style={[fonts.light, {fontSize: 45}]} className={"text-white mr-auto"}>(123) 456-7890</Text>
                    <Delete width={40} height={40} stroke={"white"} strokeWidth={1} className={"mt-3"}/>
                </View>
                <View style={styles.padContainer}>
                    <FlatList
                        numColumns={3}
                        data={buttonData}
                        renderItem={buttonItem}
                        contentContainerStyle={{
                            gap: 3,
                        }}
                        columnWrapperStyle={{
                            gap: 3
                        }}
                        scrollEnabled={false}
                    />
                    <View style={itemStyle.buttonRow}>
                        <MetroTouchable style={itemStyle.numButton} yOffset={600}>
                            <View style={itemStyle.numButton}>
                                <Text style={[fonts.light, itemStyle.charText, {fontSize: 50, marginTop: 12}]}>
                                    *
                                </Text>
                            </View>
                        </MetroTouchable>
                        {buttonItem({item: {
                            index: 0,
                            letters: "+"
                        }})}
                        <MetroTouchable style={itemStyle.numButton} yOffset={600}>
                            <View style={itemStyle.numButton}>
                                <Text style={[fonts.light, itemStyle.charText]}>
                                    #
                                </Text>
                            </View>
                        </MetroTouchable>
                    </View>
                    <View style={itemStyle.buttonRow}>
                        <MetroTouchable style={itemStyle.callButton} yOffset={600}>
                            <View style={itemStyle.callButton}>
                                <Text style={[fonts.regular, itemStyle.callButtonText]}>
                                    call
                                </Text>
                            </View>
                        </MetroTouchable>
                        <MetroTouchable style={itemStyle.saveButton} yOffset={600}>
                            <View style={itemStyle.saveButton}>
                                <Save width={20} stroke={"gray"} strokeWidth={2} className="ml-auto mr-auto mt-auto"/>
                                <Text style={fonts.regular} className="text-lg text-[#7f7f7f] text-center mb-auto">
                                    save
                                </Text>
                            </View>
                        </MetroTouchable>
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
        backgroundColor: "#383838",
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
        color: "gray",
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
        backgroundColor: "#383838",
        flex: 2.03,
        verticalAlign: "middle"
    },
    callButtonText: {
        color: "gray",
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
        backgroundColor: "#383838",
        flex: 1,
        flexDirection: "column",
        aspectRatio: 8/5,
    }
})

export default DialScreen;