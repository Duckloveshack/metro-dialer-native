import React, { useCallback, useEffect, useMemo, useRef, useState, createContext } from "react";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { View, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { fonts } from "../../styles/fonts";
import { CombinedBar } from "./MenuBar";
import Carousel from "react-native-reanimated-carousel"
import MetroView from "./MetroView";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

export const tabContext = createContext(() => {});

// slightly smaller snap to value to make the next screen peep out
// Normal value is 20. Making it 0 for testing. 
// TODO: Make the right padding a property
// const SCREEN_SNAP_INTERVAL = SCREEN_WIDTH - 0;

// let curIndex = 0;

/**
 * @param {Object} props
 * @param {Array} props.screens
 */
const MetroTabs = ({
  screens, 
  bottomBar,
  currentScreenIndex = 0,
  rightOverlapWidth = 20
}) => {
  const tabIndex = useSharedValue(0);
  const tabProgress = useSharedValue(0);
  const bottomBarElementsRef = useSharedValue(null);

  const SCREEN_SNAP_INTERVAL = SCREEN_WIDTH - rightOverlapWidth;
  const screenCnt = screens.length;

  const ref = useRef();
  // main animated node
  // everything else is interpolated on this node
  const scrollViewX = useSharedValue(0);
  const headerItemsWidthArray = useSharedValue(new Array(screenCnt+1).fill(0));

  const animatedHeaderTransformStyle = useAnimatedStyle(() => {
    // does the actual parallax interpolation
    const headerX = interpolate(
      tabProgress.value, 
      new Array(screenCnt+1)
        .fill(0)
        .map((_, i) =>  i),
      // max parallax translate for the header
      // negative because the header is translated to the left
      headerItemsWidthArray.value,
    ); 

    //console.log(headerItemsWidthArray.value)

    return {
      transform: [{ translateX: headerX }]
    }
  })

  // scrolls to the correct screen when one of the tabs are pressed
  const onTabPress = useCallback(async (index) => {
    const count = (index - tabIndex.value) < 0? index - tabIndex.value + screens.length: index - tabIndex.value;
    ref.current?.scrollTo({count: count, animated: true})
  }, []);

  // Get total header width so we can apply parallax accordingly
  const onHeaderLayout = useCallback(async (index, event) => {
    const {width} = event.nativeEvent.layout;
    headerItemsWidthArray.value = [...headerItemsWidthArray.value];
    headerItemsWidthArray.value[index] = ( headerItemsWidthArray.value[index-1] || 0 ) - width
  }, []);

  // const setTabIndex = (index) => {
  //   console.log("####### Tab index set: " + index);
  //   animatedRef.current
  //     ?.scrollTo({ animatedRef: animatedRef, x: index * SCREEN_SNAP_INTERVAL, animated: true });
  // }

  const listItem = ({item, index}) => {
    return(
      <tabContext.Provider value={{
        bottomBar: bottomBarElementsRef,
        currentTabIndex: tabIndex,
        tabIndex: index,
        tabProgress: tabProgress
      }}>
        <View 
          key={item.key} 
          style={[ styles.screenContainer, {width: SCREEN_SNAP_INTERVAL} ]}>
            {item.screen}
        </View>
      </tabContext.Provider>)
    }

  const onProgressChange = (offsetProgress, absoluteProgress) => {
    //console.log(absoluteProgress)

    if (Math.round(absoluteProgress) >= screens.length) absoluteProgress=absoluteProgress-screens.length;
    scrollViewX.value = absoluteProgress*SCREEN_WIDTH;

    tabIndex.value = Math.round(absoluteProgress);
    tabProgress.value = absoluteProgress;
  }

  return (
    <MetroView style={[
      styles.container
    ]}>
      <Animated.View
        style={[
          styles.tabContainer, 
          animatedHeaderTransformStyle,
          {width: SCREEN_WIDTH*screenCnt}
        ]}
      >
        <HeaderItem
          key={0}
          item={screens[screens.length-1]}
          index={-1}
          onPress={onTabPress}
          maxLen={screens.length}
          scrollViewX={scrollViewX}
          onLayout={(event) => onHeaderLayout(0, event)}
          screenSnapInterval={SCREEN_SNAP_INTERVAL}
        />
        {screens.map((item, index) => (
          <HeaderItem
            key={index+1}
            item={item}
            index={index}
            onPress={onTabPress}
            maxLen={screens.length}
            scrollViewX={scrollViewX}
            onLayout={(event) => onHeaderLayout(index+1, event)}
            screenSnapInterval={SCREEN_SNAP_INTERVAL}
          />
        ))}
          <HeaderItem
            key={screens.length+1}
            item={screens[0]}
            index={screens.length+1}
            onPress={onTabPress}
            maxLen={screens.length}
            scrollViewX={scrollViewX}
            onLayout={(event) => onHeaderLayout(screens.length+1, event)}
            screenSnapInterval={SCREEN_SNAP_INTERVAL}
          />
          <HeaderItem
            key={screens.length+2}
            item={screens[1]}
            index={screens.length+2}
            onPress={onTabPress}
            maxLen={screens.length}
            scrollViewX={scrollViewX}
            onLayout={(event) => onHeaderLayout(screens.length+2, event)}
            screenSnapInterval={SCREEN_SNAP_INTERVAL}
          />
      </Animated.View>
      <Carousel
        loop
        width={SCREEN_WIDTH*2}
        height={SCREEN_HEIGHT-195}
        onProgressChange={onProgressChange}
        pagingEnabled={true}
        ref={ref}
        panGestureHandlerProps={{
          activeOffsetX: [-20, 20]
        }}
        style={{
          overflow: "visible"
        }}
        
        data={screens}
        renderItem={listItem}
      />

      {bottomBar && (
        <CombinedBar progress={tabProgress} elements={bottomBarElementsRef}/>
      )}
    </MetroView>
  );
};

const activeColor = "#ffffff";
const inactiveColor = "#333333";

const HeaderItem = ({ item, index, maxLen, scrollViewX, onPress, onLayout, screenSnapInterval }) => {

  const animatedHeaderColorStyle = useAnimatedStyle(() => {
    const newColor = interpolateColor(scrollViewX.value,
      // array of snap intervals
      new Array(maxLen)
        .fill(0)
        .map((_, i) => screenSnapInterval * i),
  
      // generate a color array with active color in the index position
      new Array(maxLen)
        .fill(0)
        .map((_, i) => (i%(maxLen) === index ? activeColor : inactiveColor)),
    );
    // const bg = index == 0 ? "blue" : index == 1 ? "green" : "magenta";
    return {
      color: newColor,
      // backgroundColor: bg,
    };
  });
  
  return (
    <TouchableOpacity onPress={() => onPress(index)} onLayout={onLayout}>
      <Animated.Text style={[
        styles.tabText,
        animatedHeaderColorStyle,
        fonts.light
      ]}>
        {item.title}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0, //120
    backgroundColor: "black",
    overflow: "visible"
  },
  screenContainer: {
    height: SCREEN_HEIGHT - 180, // account for container padding top (120 original)
  },
  screenList: {
    paddingEnd: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    paddingTop: 4,
    paddingBottom: 4,
  },
  tabText: {
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 50,
  },
});

export default MetroTabs;