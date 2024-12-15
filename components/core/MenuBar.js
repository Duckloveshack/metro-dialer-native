import { useState, useRef } from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View, Animated, Easing } from "react-native";
import RoundedButton from "./RoundedButton";
import { fonts } from "../../styles/fonts";
import * as Animatable from "react-native-animatable"
import Link from "../core/Link";
import { red } from "react-native-redash";
import { FadeInUp, runOnJS, useAnimatedReaction } from "react-native-reanimated";

export const CombinedBar = ({disabled = false, progress, elements }) => {
    const AnimatedView = Animatable.createAnimatableComponent(View);

    const [bottomBarElements, setBottomBarElements] = useState(null);
    const [previousControls, setPreviousControls] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useAnimatedReaction(
      () => {
        return elements.value;
      },
      (result, previous) => {
        runOnJS(setPreviousControls)(previous?.controls)
        runOnJS(setBottomBarElements)(result)
      },
      [elements]
    )

    return (
      <View style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: "100%"
      }}>
        {expanded && (
          <TouchableWithoutFeedback
            onPress={() => {setExpanded(false)}}
          >
            <View style={{
              backgroundColor: "#ffffff00",
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 0
            }}/>
          </TouchableWithoutFeedback>
        )}
        <Animatable.View className={`bg-[#222222] w-full flex flex-col`}
          transition={["height"]}
          easing="ease-out-quart"
          duration={bottomBarElements?.options? 250: 150}
          style={{
            // if this looks ugly, its probable because of the hardcoded values
            height: expanded ? (bottomBarElements.options? 350: 80) : 60,
            marginBottom: 0,
            flexDirection: "column",
            backgroundColor: "#222",
            position: "absolute",
            bottom: 0,
            width: "100%",
            zIndex: 10
          }}
        >
          <View style={{ width: "100%", flexDirection: "row", height: expanded? 80: 55, marginBottom: -10 }}>
            <View style={{ width: '15%' }} />
            <Animatable.View style={{ width: '70%', justifyContent: 'center', flexDirection: 'row'}}>
              {(previousControls && !expanded) && (
                <View
                  style={{
                    position: "absolute",
                    flexDirection: "row",
                    height: 60,
                    overflow: "hidden"
                  }}
                >
                  {previousControls?.map((control, index) => {
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
                        <RoundedButton icon={control.icon} disabled={disabled} bounce={false} disappear={true}/>
                      </View>
                    )
                  })}
                </View>
              )}
              {bottomBarElements?.controls.map((control, index) => {
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
                    <RoundedButton icon={control.icon} action={typeof control.onPress == "function"? control.onPress: () => { console.error("control.onPress - NOT A FUNCTION - index #" + index) }} disabled={disabled} bounce={!expanded && (progress.value % 1 != 0)} disappear={false}/>
                    {expanded && (
                      <Animatable.View 
                        animation={"fadeIn"} 
                        duration={300} 
                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}
                        key={Math.random()}
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
                {bottomBarElements?.options.map((option, index) => {
                    return(
                    <AnimatedView animation="fadeInUp" duration={500} delay={50*index} key={index}>
                        <Link
                            to={"https://google.com"}
                            classOverride="text-xl py-2"
                            text={option.text}
                            onPress={() => {
                              if (typeof option.onPress == "function") {
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
        </View>
      );
}

