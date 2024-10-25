import React from "react";
import { Voicemail, Search, Book } from "react-native-feather";
import { QuickMenu, MenuBar, CombinedBar } from "../core/MenuBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text} from "react-native";

const MainBottomBar = ({
    navigation,
    methods
}) => {
  return (
    <CombinedBar controls={[
      {
        text: "voicemail",
        onPress: () => {console.log("voicemail")},
        Icon: <Voicemail width={20} stroke={"white"} strokeWidth={3}/>
      },
      {
        text: "keypad",
        onPress: () => {console.log("keypad")},
        Icon: <Voicemail width={20} stroke={"white"} strokeWidth={3}/>
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
    ]} options={[
      {
        text: "settings",
        onPress: () => { console.log("settimgs") }
      },
      {
        text: "delete all",
        onPress: null,
        disabled: true
      }
    ]} />
  )
}

export default MainBottomBar;

