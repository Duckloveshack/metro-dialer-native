import React, { Component, useContext } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { tabContext } from "../components/core/MetroTabs";
import { Voicemail, Book, Plus } from "react-native-feather";
import { fonts } from "../styles/fonts";
import MetroContext from "../components/core/MetroContext";
import MetroScroll from "../components/core/MetroScroll";
import { useAnimatedReaction } from "react-native-reanimated";

const SpeedDialScreen = ({ navigation, route}) => {
  const { bottomBar, currentTabIndex, tabIndex } = useContext(tabContext);

  const onVoicemailButton = () => { console.log("voicemail") }
  const onKeypadButton = () => { navigation.navigate("DialScreen") }
  const onPhonebookButton = () => { console.log("phonebook") }
  const onAddButton = () => { console.log("add") }

  const onSettingsLink = () => { navigation.navigate("SettingsMain") }

  useAnimatedReaction(
    () => {
      return Math.round(currentTabIndex.value)
    },
    (result) => {
      if (result == tabIndex) {
        bottomBar.value = {controls: [
          {
            text: "voicemail",
            onPress: onVoicemailButton,
            icon: "telephone"
          },
          {
            text: "keypad",
            onPress: onKeypadButton,
            icon: "thumbnails",
            disabled: false
          },
          {
            text: "phone book",
            onPress: onPhonebookButton,
            icon: "address-book"
          },
          {
            text: "add",
            onPress: onAddButton,
            icon: "plus"
          }
        ], options: [
          {
            text: "edit",
            onPress: null,
            disabled: true
          },
          {
            text: "settings",
            onPress: onSettingsLink
          }
        ], visible: true}
      }
    },
    [currentTabIndex]
  );

  return (
    <View style={styles.container}>
        <Text style={[styles.placeholder, fonts.light]}>Looking for quicker calling? Tap the plus sign to add someone to speed dial.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
    },
    list: {
      paddingBottom: 30,
    },
    itemContainer: {
      flexDirection: "row",
      marginStart: 10,
      marginBottom: 10,
    },
    placeholder: {
      color: "gray",
      fontSize: 27,
      padding: 20
    },
  });
  
  const itemStyles = StyleSheet.create({
    image: {
      height: 100,
      width: 100,
    },
    infoContainer: {
      marginStart: 10,
    },
    developer: {
      color: "white",
      fontSize: 13,
      fontWeight: "300",
      marginTop: 3,
    },
    cost: {
      color: "white",
      fontSize: 13,
      fontWeight: "300",
      marginTop: 3,
    },
  });

export default SpeedDialScreen;