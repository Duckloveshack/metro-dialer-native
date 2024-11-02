import React, { Component, useContext } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { bottomBarContext } from "../components/core/MetroTabs";
import { Voicemail, Book, Plus } from "react-native-feather";
import { fonts } from "../styles/fonts";

const SpeedDialScreen = ({ navigation, route}) => {
  const setBottomBarElements = useContext(bottomBarContext);
  setBottomBarElements({controls: [
    {
      text: "voicemail",
      onPress: () => {console.log("voicemail")},
      Icon: <Voicemail width={20} stroke={"white"} strokeWidth={3}/>
    },
    {
      text: "keypad",
      onPress: () => {console.log("keypad")},
      Icon: <Voicemail width={20} stroke={"white"} strokeWidth={3}/>,
      disabled: false
    },
    {
      text: "phone book",
      onPress: () => {console.log("phone book")},
      Icon: <Book width={20} stroke={"white"} strokeWidth={3}/>
    },
    {
      text: "add",
      onPress: () => {console.log("search")},
      Icon: <Plus width={20} stroke={"white"} strokeWidth={3}/>
    }
  ], options: [
    {
      text: "edit",
      onPress: null,
      disabled: true
    },
    {
      text: "settings",
      onPress: () => {navigation.navigate("SettingsMain")}
    }
  ]})

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