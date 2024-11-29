import { useState, useRef } from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View, Animated, Easing } from "react-native";
import RoundedButton from "./RoundedButton";
import { fonts } from "../../styles/fonts";
import * as Animatable from "react-native-animatable"
import Link from "../core/Link";
import { red } from "react-native-redash";
import { FadeInUp } from "react-native-reanimated";
import { MetroTheme } from "../../styles/theme";

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

export const CombinedBar = ({ options, controls, oldControls, height = 14, disabled = false, barExpanded = false, expanded=false, setExpanded, scrolled=false, disappear=false}) => {
    const AnimatedView = Animatable.createAnimatableComponent(View);

    //console.log(oldControls)

    return (
        <Animatable.View className={`bg-[#222222] w-full flex flex-col`}
        transition={["height"]}
        easing="ease-out-quart"
        duration={options? 250: 150}
        style={{
          // if this looks ugly, its probable because of the hardcoded values
          height: expanded ? (options? 350: 80) : 60,
          marginBottom: 0,
          flexDirection: "column",
          backgroundColor: MetroTheme.menu,
          position: "absolute",
          bottom: 0,
          width: "100%",
          }}
        >
          <View style={{ width: "100%", flexDirection: "row", height: expanded? 80: 55, marginBottom: -10 }}>
            <View style={{ width: '15%' }} />
            <Animatable.View style={{ width: '70%', justifyContent: 'center', flexDirection: 'row'}}>
              {oldControls?.map((control, index) => {
                console.log(control)
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
                  key={Math.random()}>
                    <RoundedButton Icon={control.Icon} action={control.onPress} disabled={disabled} bounce={!expanded && !scrolled} disappear={true}/>
                  </View>
                )
              })}
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
                    key={Math.random()}
                  >
                    <RoundedButton Icon={control.Icon} action={control.onPress} disabled={disabled} bounce={!expanded && !scrolled} disappear={false}/>
                    {expanded && (
                      <Animatable.View 
                        animation={"fadeIn"} 
                        duration={300} 
                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}
                        key={Math.random()}
                      >
                      <Text style={[
                        { color: disabled ? MetroTheme.inactive : MetroTheme.active, fontSize: 10, position: "absolute" },
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
                <View style={{ width: 4, height: 4, backgroundColor: MetroTheme.active, borderRadius: 2 }} />
                <View style={{ width: 4, height: 4, backgroundColor: MetroTheme.active, borderRadius: 2 }} />
                <View style={{ width: 4, height: 4, backgroundColor: MetroTheme.active, borderRadius: 2 }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {expanded && (
            <View className="flex flex-col align-left pl-4 py-4">
                {options?.map((option, index) => {
                    return(
                    <AnimatedView animation="fadeInUp" duration={500} delay={50*index} key={index}>
                        <Link
                            to={"https://google.com"}
                            classOverride="text-xl py-2"
                            text={option.text}
                            onPress={() => {
                              if (option.onPress) {
                                option.onPress()
                                setTimeout(() => {setExpanded(false)}, 250)
                              }
                            }}
                            disabled={option.disabled}
                        />
                    </AnimatedView>
                    );
                })}
            </View>
          )}
        </Animatable.View>
      );
}

