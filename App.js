import { StyleSheet, Text, StatusBar, View, Easing } from 'react-native';
import MetroTabs from './components/core/MetroTabs';
import TestScreen from './screens/TestScreen';
import * as Font from 'expo-font';
import { AppTitle } from './components/core/AppTitle';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuBar } from './components/core/MenuBar';
import MainBottomBar from './components/compound/MainBottomBar';
import { Voicemail, Search, Book, Plus } from "react-native-feather";
import { useState } from 'react';
import SimCardsManagerModule from "react-native-sim-cards-manager";
import HistoryScreen from "./screens/HistoryScreen"
import SpeedDialScreen from './screens/SpeedDialScreen';
import SettingsMain from "./screens/SettingsMain"
import { opacity, rotate, rotateY, transformOrigin } from 'react-native-redash';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    'notoSansLight': require('./assets/fonts/NotoSans-Light.ttf'),
    'notoSansRegular': require('./assets/fonts/NotoSans-Regular.ttf'),
    'notoSansExtraLight': require('./assets/fonts/NotoSans-ExtraLight.ttf'),
  });

  if (!fontsLoaded) {
    // Return a loading component or null while fonts are loading
    return null;
  }
  
  return (
    <NavigationContainer
      theme={{
        colors: {
          background: "#000000"
        }
      }}
    ><StatusBar />
      <Stack.Navigator 
      screenOptions={
        {
          headerShown: false,
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 500,
                easing: Easing.bezier(0.85, 0, 0.15, 1)
              }
            },
            close: {
              animation: "timing",
              config: {
                duration: 500,
                easing: Easing.bezier(0.85, 0, 0.15, 1)
              }
            }
          },
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                backgroundColor: "black",
                transformOrigin: "40px 50%",

                opacity: current.progress.interpolate({
                  inputRange: [0.75, 1],
                  outputRange: [0, 1]
                }),

                transform: [
                  {
                    rotateY: current.progress.interpolate({
                      inputRange: [0.75, 1],
                      outputRange: ['60deg', '0deg']
                    })
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0.75, 1],
                      outputRange: [0.85, 1]
                    })
                  },
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0.75, 1],
                      outputRange: [30, 0]
                    })
                  },
                  {
                    rotateY: next
                      ? next.progress.interpolate({
                          inputRange: [0, 0.25],
                          outputRange: ["0deg", "-60deg"],
                        })
                      : "0deg",
                  },
                  {
                    scale: next
                      ? next.progress.interpolate({
                          inputRange: [0, 0.25],
                          outputRange: [1, 1.17],
                        })
                      : 1,
                  },
                  {
                    translateX: next
                      ? next.progress.interpolate({
                          inputRange: [0, 0.25],
                          outputRange: [0, -30],
                        })
                      : 1,
                  }
                ],
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0.05, 0.2],
                  outputRange: [0, 1]
                })
              },
            };
          }
        }
        
      }>
        <Stack.Screen name="PhoneMain" component={PhoneMain} />
        <Stack.Screen name="SettingsMain" animation="fade" component={SettingsMain} options={{}}/>
        {/* Add more screens here so we can navigate to them */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// The main landing page of clock app.
// It consists of multiple screens: AlarmMain, Timer, Stopwatch, WorldClock
// All 4 screens are treated as a single continuous screen called "ClockMain",
// They have individual Bottom Bars but a same shared App Title Bar.

// Navigation between direct children of ClockMain are done using setTabIndex of MetroTabs.
// Because, if navigation.navigate is used, only that comp will be rendered without MetroTab
// Comps that don't need MetroTab, can be navigated to using navigation.navigate. Just 
// add them to Stack.screen above.
const PhoneMain = ({navigation, route}) => {
  const [carrier, setCarrier] = useState("No SIM installed");
  
  // SimCardsManagerModule.getSimCardsNative()
  //   .then((array) => {
  //     console.log(array)
  //   })

  return (
    <View style={{backgroundColor: "black", }}>

      <AppTitle title={carrier}></AppTitle>
      <MetroTabs
        rightOverlapWidth={0}
        screens={[
          { key: "0", title: "history", screen: <HistoryScreen navigation={navigation} route={route}/> },
          { key: "1", title: "speed dial", screen: <SpeedDialScreen navigation={navigation} route={route}/> }
        ]}
        bottomBar
      />
      {/* <MainBottomBar navigation={navigation} methods={
        {
          addAlarm: async () => {
            console.log("Clicked on Add New Alarm");
            // navigate to "add alarm" page using this cb
          },
        }
      }/> */}
    </View>
  );
}
