import { View, StyleSheet, Text, ScrollView } from "react-native"
import { useContext } from "react"
import MetroTouchable from "../components/core/MetroTouchable"
import { useAnimatedReaction } from "react-native-reanimated"
import { fonts } from "../styles/fonts"
import { tabContext } from "../components/core/MetroTabs"
import { Foundation } from "@expo/vector-icons"

const HistoryItem = ({
    title,
    subtitle
}) => {
    return(
        <MetroTouchable>
            <View style={itemStyles.historyItem}>
                <Foundation name="telephone" size={45} color={"white"} style={{ marginTop: "auto", marginBottom: "auto"}}/>
                <View>
                    <Text className="text-3xl" style={[fonts.light, itemStyles.actionTitle]}>
                        {title}
                    </Text>
                    <Text className="text-base" style={[fonts.regular, itemStyles.actionSubtitle]}>
                        {subtitle}
                    </Text>
                </View>
            </View>
        </MetroTouchable>
    )
}

const ContactHistoryScreen = ({
    navigation,
    route
}) => {
    const { bottomBar, currentTabIndex, tabIndex, tabProgress } = useContext(tabContext);
  
    useAnimatedReaction(
      () => {
        return Math.round(currentTabIndex.value)
      },
      (result) => {
        if (result == tabIndex) {
          bottomBar.value = {controls: [], visible: false}
        }
      },
      [currentTabIndex]
    );

    return (
        <View style={style.container}>
            <ScrollView>
                <Text style={[itemStyles.dateText, fonts.light]} className={"text-xl"}>today</Text>
                <HistoryItem title={"6 calls"} subtitle={"Last: Mobile, 8:52p"}/>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 10,
        marginBottom: 70,
        marginStart: 15
    }
})

const itemStyles = StyleSheet.create({
    dateText: {
        color: "#a013ec",
        marginBottom: 20,
    },
    historyItem: {
        marginBottom: 15,
        flexDirection: "row",
        gap: 20
    },
    actionTitle: {
        color: "white"
    },
    actionSubtitle: {
        color: "gray",
        marginTop: -3
    }
});

export default ContactHistoryScreen;