import { useState, useRef } from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View, Animated, Easing } from "react-native";
import RoundedButton from "./RoundedButton";
import { fonts } from "../../styles/fonts";
import * as Animatable from "react-native-animatable"
import Link from "../core/Link";
import { red } from "react-native-redash";
import { FadeInUp } from "react-native-reanimated";

const ShortMenu = ({ children, handleExpand }) => {
    return (
        <View className="bg-[#222222] h-14 w-full flex flex-row justify-between items-center">
            {children }
            <TouchableWithoutFeedback onPress={handleExpand}>
                <View className="w-[15%] h-full items-start justify-center flex flex-row gap-1 pt-2">
                    <View className="w-1 h-1 bg-white rounded-full" />
                    <View className="w-1 h-1 bg-white rounded-full" />
                    <View className="w-1 h-1 bg-white rounded-full" />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export const MenuBar = ({ options, controls, height = 14 }) => {
    const [expanded, setExpanded] = useState(false);
    const what = () => {
      console.log("test")
    }
    
    return <Animatable.View
      transition={["height"]}
      duration={250}
      style={{
        // if this looks ugly, its probable because of the hardcoded values
        height: expanded ? 350 : 60,
        marginBottom: 0,
        flexDirection: "row",
        backgroundColor: "#222",
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      {expanded ? (
        <View className={`bg-[#222222] w-full flex flex-col`}>
          <ShortMenu handleExpand={() => setExpanded(false)}>
            {controls}
          </ShortMenu>
          <ScrollView className="w-full h-full">
            <View className="flex flex-col gap-16 w-full">
              {/* sadly there is no gap in react-native yet */}
              {options}
            </View>
          </ScrollView>
        </View>
      ) : (
        <ShortMenu handleExpand={() => setExpanded(true)}>{controls}</ShortMenu>
      )}
    </Animatable.View>;
    // if (!expanded) {
    //   return (
    //   );
    // } else {
    //   return (
  
    //   );
    // }
  };


  export const QuickMenu = ({ options, disabled = false }) => {
    const [expanded, setExpanded] = useState(false);
    const heightAnim = useRef(new Animated.Value(60)).current;
  
    const toggleExpand = () => {
      setExpanded(!expanded);
      Animated.timing(heightAnim, {
        toValue: expanded ? 60 : 80,
        duration: 150,
        useNativeDriver: false,
      }).start();
      console.log(options);
    };
  
    return (
      <Animated.View
        style={{
          height: heightAnim,
          marginBottom: 0,
          flexDirection: "row",
          backgroundColor: "#222",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <View style={{ width: '15%' }} />
        <View style={{ width: '70%', justifyContent: 'center', flexDirection: 'row' }}>
          {options.map((option, index) => {
            return (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 16,
                  marginVertical: 8,
                  marginBottom: 12,
                  paddingHorizontal: 4,
                }}
                key={index}
              >
                <RoundedButton Icon={option.Icon} action={option.onPress} disabled={disabled}/>
                {expanded && (
                  <Animatable.View 
                    animation="fadeIn" 
                    duration={300} 
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}
                  >
                    <Text style={[
                      { color: disabled ? '#8a8a8a' : 'white', fontSize: 10 },
                      fonts.light
                    ]}>
                      {option.text}
                    </Text>
                  </Animatable.View>
                )}
              </View>
            );
          })}
        </View>
        <TouchableWithoutFeedback onPress={toggleExpand}>
          <View style={{ 
            width: '15%', 
            height: '100%', 
            alignItems: 'flex-start', 
            justifyContent: 'center', 
            flexDirection: 'row', 
            gap: 4, 
            paddingTop: 8 
          }}>
            <View style={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: 2 }} />
            <View style={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: 2 }} />
            <View style={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: 2 }} />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  };

export const CombinedBar = ({ options, controls, height = 14, disabled = false, barExpanded = false, expanded, setExpanded }) => {
    const AnimatedView = Animatable.createAnimatableComponent(View);

    return (
        <Animatable.View className={`bg-[#222222] w-full flex flex-col`}
        transition={["height"]}
        easing="ease-out-sine"
        duration={250}
        style={{
          // if this looks ugly, its probable because of the hardcoded values
          height: expanded ? 350 : 60,
          marginBottom: 0,
          flexDirection: "column",
          backgroundColor: "#222",
          position: "absolute",
          bottom: 0,
          width: "100%",
          }}
        >
          <View style={{ width: "100%", flexDirection: "row", height: expanded? 80: 55, marginBottom: -10 }}>
            <View style={{ width: '15%' }} />
            <Animatable.View easing={"ease-out-back"} duration={300} animation="fadeInUp" style={{ width: '70%', justifyContent: 'center', flexDirection: 'row'}}>
              {controls?.map((control, index) => {
                return (
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 16,
                      marginVertical: 8,
                      marginBottom: 12,
                      paddingHorizontal: 4
                    }}
                    key={index}
                  >
                    <RoundedButton Icon={control.Icon} action={control.onPress} disabled={disabled}/>
                    {expanded && (
                      <Animatable.View 
                        animation="fadeIn" 
                        duration={300} 
                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}
                      >
                      <Text style={[
                        { color: disabled ? '#8a8a8a' : 'white', fontSize: 10, position: "absolute" },
                        fonts.light
                      ]}>
                        {control.text}
                      </Text>
                      </Animatable.View>
                    )}
                  </View>
                );
              })}
            </Animatable.View>
            <TouchableWithoutFeedback onPress={() => {setExpanded(!expanded)}}>
              <View style={{ 
                width: '15%', 
                height: '100%', 
                alignItems: 'flex-start', 
                justifyContent: 'center', 
                flexDirection: 'row', 
                gap: 4, 
                paddingTop: 8 
              }}>
                <View style={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: 2 }} />
                <View style={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: 2 }} />
                <View style={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: 2 }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {expanded && (
            <View className="flex flex-col align-left pl-4 py-4">
                {options?.map((option, index) => {
                    return(
                    <AnimatedView animation="fadeInUp" duration={500} delay={50*index}>
                        <Link
                            to={"https://google.com"}
                            classOverride="text-xl py-2"
                            text={option.text}
                            onPress={option.onPress}
                            disabled={option.disabled}
                            key={index}
                        />
                    </AnimatedView>
                    );
                })}
            </View>
          )}
        </Animatable.View>
      );
}

