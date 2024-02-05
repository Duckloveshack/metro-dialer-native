import React from "react";
import { Plus } from "react-native-feather";
import { QuickMenu } from "../core/MenuBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddAlarmBottomBar = ({
    navigation,
    methods
}) => {
    return (
        <QuickMenu 
            options={[
                {
                    text: "add",
                    onPress: methods.addAlarm,
                    Icon: <Plus width={20} stroke={"white"} strokeWidth={3}/>
                }
            ]}
        />
    )
}

export default AddAlarmBottomBar;

