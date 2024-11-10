import React, { useState, Component, useContext } from "react";
import { StyleSheet, View, Text, FlatList, Image, Button } from "react-native";
import { fonts } from "../styles/fonts";
import ToggleSwitch from "../components/core/ToggleSwitch";
import AddAlarmBottomBar from "../components/compound/MainBottomBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { bottomBarContext } from "../components/core/MetroTabs";
import { Voicemail, Book, Search } from "react-native-feather";


const AlarmMain = ({
  navigation,
  setTabIndex
}) => {  

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
      text: "search",
      onPress: () => {console.log("search")},
      Icon: <Search width={20} stroke={"white"} strokeWidth={3}/>
    }
  ], options: [
    {
      text: "settings",
      onPress: () => { console.log("settimgs") }
    },
    {
      text: "delete all",
      onPress: null,
      disabled: true
    }
  ]})

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
      {/* <Button
        title="Test setTabIndex function"
        onPress={() => setTabIndex(1)}
      /> */}
      {/* <FlatList
        contentContainerStyle={styles.list}
        data={alarmData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      /> */}
      <Text style={[itemStyles.time]}>I haven't started working on this part yet</Text>

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
  const repeatText = alarmRepeat && alarmRepeat.length > 0 ? alarmRepeat.join(', ') : 'Only once'

  return (
    <View style={styles.itemContainer}>
      {/* <View style={styles.infoContainer}>
        <Text style={[itemStyles.time, fonts.regular]}>{alarmTime}</Text>
        <Text style={[itemStyles.repeat, fonts.regular]}>
          {isAlarmOn ? 'On' : 'Off'} : {alarmName}
        </Text>
        <Text style={[itemStyles.repeat, fonts.extraLight]}>{repeatText}</Text>
      </View>
      <View style={itemStyles.toggleSwitch}>
        <ToggleSwitch isOn={isAlarmOn} onToggle={handleToggleSwitch}></ToggleSwitch>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
      marginTop: 25,
      // height: "80%" // So we can see the bottom bar (TODO: Make it responsive)
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
    bottomBarContainer: {
      width: "100%",
      position: 'absolute',
      bottom: 0,
      flex: 1,
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