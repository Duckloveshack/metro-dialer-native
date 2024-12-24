import React, { Component, useContext } from "react";
import { StyleSheet, View, Text, FlatList, Image, ScrollView, Platform } from "react-native";
import { tabContext } from "../components/core/MetroTabs";
import { Voicemail, Book, Search, User } from "react-native-feather";
import { fonts } from "../styles/fonts";
import RoundedButton from "../components/core/RoundedButton";
//import { ScrollView } from "react-native-gesture-handler";
import MetroContext from "../components/core/MetroContext";
import MetroScroll from "../components/core/MetroScroll";
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, interpolate } from "react-native-reanimated";
import Foundation from "@expo/vector-icons/Foundation"

const HistoryScreen = ({navigation, route}) => {
  const { bottomBar, currentTabIndex, tabIndex, tabProgress } = useContext(tabContext);

  const onVoicemailButton = () => { console.log("voicemail") }
  const onKeypadButton = () => { navigation.navigate("DialScreen") }
  const onPhonebookButton = () => { console.log("phonebook") }
  const onSearchButton = () => { console.log("search") }

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
            text: "search",
            onPress: onSearchButton,
            icon: "magnifying-glass",
          }
        ], options: [
          {
            text: "settings",
            onPress: onSettingsLink
          },
          {
            text: "delete all",
            onPress: null,
            disabled: true
          },
        ], visible: true}
      }
    },
    [currentTabIndex]
  );

  const historyDescritionStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            tabProgress.value%0.5,
            [-0.5, -0.25, 0.25, 0.5],
            [50, 50, -50, -50]
          )
        }
      ]
    }
  })

  const historyItem = ({item, index}) => {
    return(
      <MetroContext
        options={[
          {
            label: "details"
          },
          {
            label: "delete"
          },
          {
            label: "add to speed dial"
          }
        ]}
        canTilt={false}
      >
      <View style={styles.itemContainer}>
        <View style={itemStyles.infoContainer}>
          <Text style={[itemStyles.number, fonts.light]}>
            {item.number}
          </Text>
          <Animated.Text style={[itemStyles.details, fonts.light, historyDescritionStyle]}>
            Outgoing, Thu 7:18p
          </Animated.Text>
        </View>
        <View style={itemStyles.button}>
            {/* <RoundedButton Icon={<User width={20} stroke={"white"} strokeWidth={3}/>} action={() => {}}/> */}
            <RoundedButton icon={"torsos"} action={() => { navigation.navigate("ContactInfoMain") }}/>
          </View>
      </View>
      </MetroContext>
    );
  }

  const sampleData = [
    {
      number: "+1 (425) 001-0001"
    },
    {
      number: "+1 (425) 001-0001"
    },
    {
      number: "+1 (425) 001-0001"
    },
    {
      number: "+1 (425) 001-0001"
    },
    {
      number: "+1 (425) 001-0001"
    },
    {
      number: "+1 (425) 001-0001"
    },
    {
      number: "+1 (425) 001-0001"
    },
    {
      number: "+1 (425) 001-0001"
    },
    {
      number: "+1 (425) 001-0001"
    },
  ]

  return sampleData? (
    <ScrollView style={[styles.container]}>
        <View>
            {sampleData.map((data, index) => {
              return historyItem({item: data, index: index})
            })}
        </View>
    </ScrollView>
    // <MetroScroll
    //   data={sampleData}
    //   renderItem={historyItem}
    // />
  ) : (
    <Text style={[styles.placeholder, fonts.light]}>Calls you make or receive will appear here. Tap the keypad icon to call someone.</Text>
  )
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: "black",
      paddingTop: 10,
      marginBottom: 70,
    },
    list: {
      paddingBottom: 30,
    },
    itemContainer: {
      backgroundColor: "black",
      flexDirection: "row",
      marginStart: 10,
      paddingBottom: 7,
      paddingTop: 7,
      width: "100%",
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