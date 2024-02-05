import React, { useState, Component } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import sampleStoreData from "./Data.json";
import { fonts } from "../styles/fonts";
import ToggleSwitch from "../components/core/ToggleSwitch";
import AddAlarmBottomBar from "../components/compound/AddAlarmBottomBar";

const AlarmMain = ({
  navigation
}) => {  

  const alarmData = [
    {
      id: '1',
      alarmTime: '8:00 PM',
      alarmState: false,
      alarmName: 'Walk the doggy',
      alarmRepeat: ['Sun', 'Mon', 'Tue', 'Wed'],
    },
    {
      id: '2',
      alarmTime: '6:20 AM',
      alarmState: true,
      alarmName: 'Ready for work',
      alarmRepeat: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: '3',
      alarmTime: '5:00 PM',
      alarmState: true,
      alarmName: 'Buy toys',
    },
    {
      id: '4',
      alarmTime: '11:20 PM',
      alarmState: false,
      alarmName: 'do something',
    },
  ];

  const renderItem = ({ item }) => (
    <AlarmItem
      alarmTime={item.alarmTime}
      alarmState={item.alarmState}
      alarmName={item.alarmName}
      alarmRepeat={item.alarmRepeat}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}        
        data={alarmData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <AddAlarmBottomBar navigation={navigation} methods={
        {
          addAlarm: async () => {
            console.log("Clicked on Add New Alarm");
            // navigate to add alarm page using this cb
          }
        }
      }></AddAlarmBottomBar>
    </View>
    
  );
};

const AlarmItem = ({
  alarmTime,
  alarmState,
  alarmName,
  alarmRepeat
}) => {
  const [isAlarmOn, setIsAlarmOn] = useState(alarmState);
  const handleToggleSwitch = () => {
    setIsAlarmOn(!isAlarmOn);
  };
  const repeatText = alarmRepeat && alarmRepeat.length > 0 ? alarmRepeat.join(', ') : 'Only once';

  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={[itemStyles.time, fonts.regular]}>{alarmTime}</Text>
        <Text style={[itemStyles.repeat, fonts.regular]}>
          {isAlarmOn ? 'On' : 'Off'} : {alarmName}
        </Text>
        <Text style={[itemStyles.repeat, fonts.extraLight]}>{repeatText}</Text>
      </View>
      <View style={itemStyles.toggleSwitch}>
        <ToggleSwitch isOn={isAlarmOn} onToggle={handleToggleSwitch}></ToggleSwitch>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: "black",
      marginTop: 25,
      height: "80%" // So we can see the bottom bar (TODO: Make it responsive)
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
  });
  
  const itemStyles = StyleSheet.create({
    infoContainer: {
      marginStart: 10,
    },
    time: {
      color: "white",
      fontSize: 28,
      fontWeight: "400",
      marginBottom: -5,
    },
    repeat: {
      color: "white",
      fontSize: 12,
      fontWeight: "300",
    },
    toggleSwitch: {
      width: "100%", 
      flexDirection: "row", 
      flex: 1, 
      justifyContent: 'flex-end', 
      margin: 16,
      marginRight: 28,
    }
  });

export default AlarmMain;