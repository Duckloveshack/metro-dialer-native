import React, { Component, useContext } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import sampleStoreData from "./Data.json";
import { bottomBarContext } from "../components/core/MetroTabs";
import { Voicemail, Book, Plus } from "react-native-feather";

const TestScreen = () => {
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
      onPress: () => { console.log("settimgs") }
    },
  ]})

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={sampleStoreData}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.icon }} style={itemStyles.image} />
            <View style={itemStyles.infoContainer}>
              <Text style={itemStyles.title}>{item.title}</Text>
              <Text style={itemStyles.developer}>{item.developer}</Text>
              <Text style={itemStyles.cost}>
                {item.cost ? `$${item.cost}` : "free"}
              </Text>
            </View>
          </View>
        )}
      />
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
  });
  
  const itemStyles = StyleSheet.create({
    image: {
      height: 100,
      width: 100,
    },
    infoContainer: {
      marginStart: 10,
    },
    title: {
      color: "white",
      fontSize: 25,
      fontWeight: "300",
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

export default TestScreen;