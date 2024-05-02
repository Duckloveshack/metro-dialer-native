import React, { useCallback, useEffect, useState } from "react";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { fonts } from "../../styles/fonts";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

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
  currentScreenIndex = 0,
  rightOverlapWidth = 20
}) => {
  const SCREEN_SNAP_INTERVAL = SCREEN_WIDTH - rightOverlapWidth;
  // console.log(screens);
  const screenCnt = screens.length;

  const animatedRef = useAnimatedRef();
  // main animated node
  // everything else is interpolated on this node
  const scrollViewX = useSharedValue(0);
  const headerItemsWidthArray = useSharedValue(new Array(screenCnt+1).fill(0));
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollViewX.value = event.contentOffset.x;
  });

  const animatedHeaderTransformStyle = useAnimatedStyle(() => {
    // does the actual parallax interpolation
    const headerX = interpolate(
      scrollViewX.value, 
      new Array(screenCnt+1)
        .fill(0)
        .map((_, i) => SCREEN_SNAP_INTERVAL * i),
      // max parallax translate for the header
      // negative because the header is translated to the left
      headerItemsWidthArray.value,
    ); 

    return {
      transform: [{ translateX: headerX }]
    }
  })

  // scrolls to the correct screen when one of the tabs are pressed
  const onTabPress = useCallback(async (index) => {
    animatedRef.current
      ?.scrollTo({ animatedRef: animatedRef, x: index * SCREEN_SNAP_INTERVAL, animated: true });
  }, []);

  // Get total header width so we can apply parallax accordingly
  const onHeaderLayout = useCallback(async (index, event) => {
    const {x, y, height, width} = event.nativeEvent.layout;
    headerItemsWidthArray.value = [...headerItemsWidthArray.value];
    headerItemsWidthArray.value[index+1] = headerItemsWidthArray.value[index] + width*-1; // negative cause header translates to left
  }, []);

  const setTabIndex = (index) => {
    console.log("####### Tab index set: " + index);
    animatedRef.current
      ?.scrollTo({ animatedRef: animatedRef, x: index * SCREEN_SNAP_INTERVAL, animated: true });
  }

  const renderItem = (item, index) => {
    const ScreenComponent = item.screen;
    return (
      <View key={item.key}>
        <ScreenComponent setTabIndex={setTabIndex} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.tabContainer, 
          animatedHeaderTransformStyle,
          {width: SCREEN_WIDTH*screenCnt}
        ]}
      >
        {screens.map((item, index) => (
          <HeaderItem
            key={index}
            item={item}
            index={index}
            onPress={onTabPress}
            maxLen={screens.length}
            scrollViewX={scrollViewX}
            onLayout={(event) => onHeaderLayout(index, event)}
            screenSnapInterval={SCREEN_SNAP_INTERVAL}
          />
        ))}
      </Animated.View>

      <Animated.ScrollView
        horizontal
        bounces={true}
        ref={animatedRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        pagingEnabled={true}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        // overScrollMode={"never"} to fix a stupid Android 14 bug.
        // Ref 1: https://github.com/facebook/react-native/issues/41034
        // Ref 2: https://issuetracker.google.com/issues/286422637?pli=1
        overScrollMode={"never"} 
        snapToInterval={SCREEN_SNAP_INTERVAL}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.screenList}
      >
        {/* {screens.map((item) => (
          <View 
            key={item.key} 
            style={[ styles.screenContainer, {width: SCREEN_SNAP_INTERVAL} ]}>
              {item.screen}
          </View>
        ))} */}
        
        {/* Adding setTabIndex prop to screens so children can change tabs */}
        {screens.map((item) => (
          <View 
            key={item.key} 
            style={[ styles.screenContainer, {width: SCREEN_SNAP_INTERVAL} ]}>
              {React.cloneElement(item.screen, { setTabIndex })}
          </View>
        ))}

        {/* {screens.map((item, index) => renderItem(item, index))} */}
      </Animated.ScrollView>
      
    </View>
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
        .map((_, i) => (i === index ? activeColor : inactiveColor)),
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
        fonts.regular
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
  },
  screenContainer: {
    height: SCREEN_HEIGHT - 170, // account for container padding top (120 original)
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
