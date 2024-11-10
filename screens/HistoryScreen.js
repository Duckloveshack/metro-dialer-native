import React, { Component, useContext } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { bottomBarContext } from "../components/core/MetroTabs";
import { Voicemail, Book, Search, User } from "react-native-feather";
import { fonts } from "../styles/fonts";
import RoundedButton from "../components/core/RoundedButton";
import ContextFlatList from "../components/core/ContextFlatList";

const HistoryScreen = ({navigation, route}) => {
  const setBottomBarElements = useContext(bottomBarContext);
  setBottomBarElements({controls: [
    {
      text: "voicemail",
      onPress: () => {console.log("voicemail")},
      Icon: <Voicemail width={20} stroke={"white"} strokeWidth={3}/>
    },
    {
      text: "keypad",
      onPress: () => {navigation.navigate("DialScreen")},
      Icon: <Voicemail width={20} stroke={"white"} strokeWidth={3}/>,
      disabled: false
    },
    {
      text: "phone book",
      onPress: () => {console.log("phone book")},
      Icon: <Book width={20} stroke={"white"} strokeWidth={3}/>
    },
    {
      text: "search",
      onPress: () => {console.log("search")},
      Icon: <Search width={20} stroke={"white"} strokeWidth={3}/>
    }
  ], options: [
    {
      text: "settings",
      onPress: () => {navigation.navigate("SettingsMain")}
    },
    {
      text: "delete all",
      onPress: null,
      disabled: true
    },
  ]});

  const historyItem = ({item, index}) => {
    return(
      <View style={styles.itemContainer}>
        <View style={itemStyles.infoContainer}>
          <Text style={[itemStyles.number, fonts.light]}>
            {item.number}
          </Text>
          <Text style={[itemStyles.details, fonts.light]}>
            Outgoing, Thu 7:18p
          </Text>
        </View>
        <View style={itemStyles.button}>
            <RoundedButton Icon={<User width={20} stroke={"white"} strokeWidth={3}/>} action={() => {}}/>
          </View>
      </View>
    );
  }

  const sampleData = [
    {
      number: "+1 (425) 001-0001",
      context_options: [
        {
          label: "details"
        },
        {
          label: "delete"
        },
        {
          label: "add to speed dial"
        }
      ]
    },
    {
      number: "+1 (425) 001-0001",
      context_options: [
        {
          label: "delete"
        }
      ]
    },
    {
      number: "+1 (425) 001-0001",
      context_options: [
        {
          label: "delete"
        }
      ]
    },
    {
      number: "+1 (425) 001-0001",
      context_options: [
        {
          label: "delete"
        },
      ]
    }
  ]

  return (
    <View style={styles.container}>
        {sampleData? (        
          <ContextFlatList
            data={sampleData}
            renderItem={historyItem}
          />
        ) : (
          <Text style={[styles.placeholder, fonts.light]}>Calls you make or receive will appear here. Tap the keypad icon to call someone.</Text>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: "black",
      paddingTop: 10
    },
    list: {
      paddingBottom: 30,
    },
    itemContainer: {
      backgroundColor: "black",
      flexDirection: "row",
      marginStart: 10,
      marginBottom: 14,
      width: "100%"
    },
    placeholder: {
      color: "gray",
      fontSize: 27,
      padding: 20
    }
  });
  
const itemStyles = StyleSheet.create({
    infoContainer: {
      marginStart: 10,
    },
    number: {
      color: "white",
      fontSize: 25
    },
    details: {
      color: "gray",
      fontSize: 15
    },
    button: {
      width: "100%", 
      flexDirection: "row", 
      flex: 1, 
      justifyContent: 'flex-end', 
      margin: 16,
      marginRight: 28,
      marginTop: 0
    }
  });

export default HistoryScreen;