import React from "react";
import { Plus } from "react-native-feather";
import { QuickMenu } from "../core/MenuBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewTimerBottomBar = ({
    navigation,
    methods
}) => {
  return (
    <QuickMenu 
      options={[
        {
          text: "new",
          onPress: methods.newTimer,
          Icon: <Plus width={20} stroke={"white"} strokeWidth={3}/>
        }
      ]}
    />
  )
}

export default NewTimerBottomBar;

