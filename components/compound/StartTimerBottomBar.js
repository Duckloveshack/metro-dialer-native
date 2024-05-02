import React from "react";
import { Play } from "react-native-feather";
import { QuickMenu } from "../core/MenuBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StartTimerBottomBar = ({
    navigation,
    methods
}) => {
  return (
    <QuickMenu 
      options={[
        {
          text: "start",
          onPress: methods.startTimer,
          Icon: <Play width={20} stroke={"white"} strokeWidth={3}/>
        }
      ]}
    />
  )
}

export default StartTimerBottomBar;

