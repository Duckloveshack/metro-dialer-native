import React, { useState, Component } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { fonts } from "../styles/fonts";
import ToggleSwitch from "../components/core/ToggleSwitch";
import StartTimerBottomBar from "../components/compound/StartTimerBottomBar";
import TimePicker from "../components/core/TimePicker";
import { AppTitle } from '../components/core/AppTitle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const HOUR_INDEX = 10;
const MINUTE_INDEX = 20;
const SECOND_INDEX = 30;

const TimerNew = ({
  navigation,
  route
}) => {  
  
  const { onTimerStart, initialHour, initialMinute, initialSecond } = route.params;

  const listHours = new Array(24).fill(0).map((_, i) => String(i).padStart(2, '0'));
  const listMinutes = new Array(60).fill(0).map((_, i) => String(i).padStart(2, '0'));
  const listSeconds = new Array(60).fill(0).map((_, i) => String(i).padStart(2, '0'));

  const [hour, setHour] = useState(parseInt(listHours[initialHour]));
  const [minute, setMinute] = useState(parseInt(listMinutes[initialMinute]));
  const [second, setSecond] = useState(parseInt(listSeconds[initialSecond]));

  const handleHourChange = (index, value) => {
    // console.log("[ HOUR ] index: " + index + ", data[index]: " + listHours[index] + ", value: " + value);
    setHour(parseInt(listHours[index]));
  }
  const handleMinuteChange = (index, value) => {
    // console.log("[MINUTE] index: " + index + ", data[index]: " + listMinutes[index] + ", value: " + value);
    setMinute(parseInt(listMinutes[index]));
  }
  const handleSecondChange = (index, value) => {
    // console.log("[SECOND] index: " + index + ", data[index]: " + listSeconds[index] + ", value: " + value);
    setSecond(parseInt(listSeconds[index]));
  }

  return (
    <View style={styles.container}>
      <AppTitle title={"clock"}></AppTitle>
      <Text style={styles.title}>
        new timer
      </Text>
      {/* Time pickers */}
      <View style={styles.timePickerContainer}>
        <TimePicker
          values={listHours}
          unit="h"
          initialSelectedIndex={initialHour}
          activeTextColor='white'
          squareCount={5}
          onValueChange={handleHourChange}
        />
        <TimePicker
          values={listMinutes}
          unit="m"
          initialSelectedIndex={initialMinute}
          activeTextColor='white'
          squareCount={5}
          onValueChange={handleMinuteChange}
        />
        <TimePicker
          values={listSeconds}
          unit="s"
          initialSelectedIndex={initialSecond}
          activeTextColor='white'
          squareCount={5}
          onValueChange={handleSecondChange}
        />
      </View>

      {/* padding */}
      {/* <View style={{height: "30%", backgroundColor: 'black'}}></View> */}
      {/* Bottom bar */}
      <View style={styles.bottomBarContainer}>
        <StartTimerBottomBar navigation={navigation} methods={
          {
            startTimer: async () => {
              // Return selected values to ClockMain, which will further pass them to TimerMain
              // Directly navigating to TimerMain will drop the MetroTab lol
              navigation.navigate({
                name: "ClockMain", 
                params: {
                  timer: {
                    selectedHour: hour,
                    selectedMinute: minute,
                    selectedSecond: second,
                    started: true,
                  },
                }, 
                // https://reactnavigation.org/docs/upgrading-from-5.x/#params-are-now-overwritten-on-navigation-instead-of-merging
                merge: true, 
              });
            }
          }
        }></StartTimerBottomBar>
      </View>  
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
      width: "100%",
      // justifyContent: 'center',
      // alignItems: 'center',
      // height: "80%", // So we can see the bottom bar (TODO: Make it responsive)
    },
    timePickerContainer: {
      // flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 80,
      // gap: 20,
    },
    bottomBarContainer: {
      width: "100%",
      position: 'absolute',
      bottom: 0,
      flex: 1,
    },
    title: {
      color: 'white',
      paddingRight: 10,
      paddingLeft: 10,
      fontSize: 60
    }
  });



export default TimerNew;