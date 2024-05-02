import React, { useState, Component, useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { fonts } from "../styles/fonts";
import Button from "../components/core/Button";
import NewTimerBottomBar from "../components/compound/NewTimerBottomBar";
import TimePicker from "../components/core/TimePicker";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const TimerMain = ({
  navigation,
  route,
  setTabIndex
}) => {  
  
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);
  
  const [currentSec, setCurrentSec] = useState(0);
  const [delay, setDelay] = useState(null);

  function useInterval(callback, delay) {
    const savedCallback = useRef();
   
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
   
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useEffect(() => {
    if (route.params?.timer) {
      const h = route.params?.timer.selectedHour;
      const m = route.params?.timer.selectedMinute;
      const s = route.params?.timer.selectedSecond;
      setSelectedHour(h);
      setSelectedMinute(m);
      setSelectedSecond(s);
      setDelay(1000); // Start Timer
      const msec = (h*3600) + (m*60) + s;
      setCurrentSec(msec);
    }
  }, [route.params?.timer])

  useInterval(() => {
    console.log(currentSec);
    setCurrentSec((currentMsec) => {
      if (currentMsec > 0) {
        return (currentMsec-1);
      } else {
        setDelay(null);
        return 0;
      }

    });
  }, delay);

  const handleReset = () => {
    setDelay(null); // Stop timer
    const sec = (selectedHour*3600) + (selectedMinute*60) + selectedSecond;
    setCurrentSec(sec);
    console.log("Reset!");
  }
  const handleStartStop = () => {
    setDelay(prevDelay => prevDelay ? null : 1000); // Start or stop timer
  }


  return (
    <View style={styles.container}>

      <View style={styles.timerItemContainer}>
        <View style={styles.numberContainer}>
          <Text style={styles.timerText}>
            {String(Math.floor((currentSec / (60*60)) % 24)).padStart(2, '0')}
          </Text>
          <Text style={styles.timerText}>
            :
          </Text>

          <Text style={styles.timerText}>
            {String(Math.floor((currentSec / (60)) % 60)).padStart(2, '0')}
          </Text>
          <Text style={styles.timerText}>
            :
          </Text>

          <Text style={styles.timerText}>
            {String(Math.floor(currentSec % 60)).padStart(2, '0')}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button text={"reset"} onPress={handleReset} classOverride="flex-grow" ></Button>
          <Button text={delay ? "stop" : "start"} onPress={handleStartStop} disabled={currentSec==0?true:false} classOverride="flex-grow" ></Button>
          {/* <Button text={"Stop"} ></Button> */}
        </View>

      </View>
      
      {/* Bottom bar */}
      <View style={styles.bottomBarContainer}>
        <NewTimerBottomBar navigation={navigation} methods={
          {
            newTimer: async () => {
              console.log("Clicked on Add New Timer");
              setDelay(null);
              navigation.navigate("TimerNew", {
                initialHour: selectedHour,
                initialMinute: selectedMinute,
                initialSecond: selectedSecond
              });
            }
          }
        }></NewTimerBottomBar>
      </View>

    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      width: "100%",
      flexDirection: "column",
      paddingTop: "50%"
      // height: "80%", // So we can see the bottom bar (TODO: Make it responsive)
    },
    bottomBarContainer: {
      width: "100%",
      position: 'absolute',
      bottom: 0,
      flex: 1,
    },
    timerItemContainer: {
      height: '100%',
      width: "100%",
      flexDirection: 'column',
      // justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
    },
    numberContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 2,
    },
    buttonContainer: {
      fex: 1,
      position: 'absolute',
      bottom: 90,
      width: "100%",
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 20,
      gap: 10,
    },
    timerText: {
      fontSize: 80,
      color: "white",
      // fontWeight: "bold",

    }
  });



export default TimerMain;