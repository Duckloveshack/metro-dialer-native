import { View, StyleSheet, Text, ScrollView } from "react-native"
import { useContext } from "react"
import MetroTouchable from "../components/core/MetroTouchable"
import { useAnimatedReaction } from "react-native-reanimated"
import { fonts } from "../styles/fonts"
import { tabContext } from "../components/core/MetroTabs"

const ProfileItem = ({
    title,
    subtitle,
    action
}) => {
    return(
        <MetroTouchable>
            <View style={itemStyles.profileItem}>
                <Text className="text-3xl" style={[fonts.light, itemStyles.actionTitle]}>
                    {title}
                </Text>
                <Text className="text-base" style={[fonts.regular, itemStyles.actionSubtitle]}>
                    {subtitle}
                </Text>
            </View>
        </MetroTouchable>
    )
}

const ContactProfileScreen = ({
    navigation,
    route
}) => {
    const { bottomBar, currentTabIndex, tabIndex, tabProgress } = useContext(tabContext);

    const onPinButton = () => { navigation.push("PhoneMain") }
    //const onLinkButton = () => { console.log("link") }
    const onEditButton = () => { console.log("edit") }
  
    useAnimatedReaction(
        () => {
          return Math.round(currentTabIndex.value)
        },
        (result) => {
          if (result == tabIndex) {
            bottomBar.value = {controls: [
              {
                text: "pin",
                onPress: onPinButton,
                icon: "bookmark"
              },
              {
                text: "edit",
                onPress: onEditButton,
                icon: "pencil"
              }
            ], options: [
              {
                text: "share contact",
                onPress: null
              },
              {
                text: "delete",
                onPress: null
              },
            ], visible: true}
          }
        },
        [currentTabIndex]
      );

    return (
        <View style={style.container}>
            <ScrollView>
                <ProfileItem title={"call mobile"} subtitle={"+1 (425) 001-0001"}/>
                <ProfileItem title={"text"} subtitle={"SMS"}/>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 20,
        marginBottom: 70,
        marginStart: 15
    }
})

const itemStyles = StyleSheet.create({
    profileItem: {
        marginBottom: 15
    },
    actionTitle: {
        color: "white"
    },
    actionSubtitle: {
        color: "#a013ec",
        marginTop: -3
    }
});

export default ContactProfileScreen;