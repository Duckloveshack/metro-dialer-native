import React, { useCallback, useEffect, useMemo, useRef, useState, createContext } from "react";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { View, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { fonts } from "../../styles/fonts";
import { CombinedBar } from "./MenuBar";
import Carousel from "react-native-reanimated-carousel"
 

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

export const bottomBarContext = createContext(() => {});

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
  const [bottomBarElements, setBottomBarElements] = useState(null)
  const [tabIndex, setTabIndex] = useState(0);
  const [expanded, setExpanded] = useState(false)

  const SCREEN_SNAP_INTERVAL = SCREEN_WIDTH - rightOverlapWidth;
  // console.log(screens);
  const screenCnt = screens.length;

  const animatedRef = useAnimatedRef();
  const ref = useRef();
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
    // animatedRef.current
    //   ?.scrollToIndex({ animatedRef: animatedRef, index: index, animated: true });
    ref.current?.scrollTo({index: index, animated: true})
  }, []);

  // Get total header width so we can apply parallax accordingly
  const onHeaderLayout = useCallback(async (index, event) => {
    const {x, y, height, width} = event.nativeEvent.layout;
    headerItemsWidthArray.value = [...headerItemsWidthArray.value];
    headerItemsWidthArray.value[index+1] = headerItemsWidthArray.value[index] + width*-1; // negative cause header translates to left
  }, []);

  // const setTabIndex = (index) => {
  //   console.log("####### Tab index set: " + index);
  //   animatedRef.current
  //     ?.scrollTo({ animatedRef: animatedRef, x: index * SCREEN_SNAP_INTERVAL, animated: true });
  // }

  const listItem = ({item}) => {
    return(
      <bottomBarContext.Provider value={item.key == tabIndex? setBottomBarElements : () => {}}>
        <View 
          key={item.key} 
          style={[ styles.screenContainer, {width: SCREEN_SNAP_INTERVAL} ]}>
            {item.screen}
        </View>
      </bottomBarContext.Provider>)
    }

    const onViewableItemsChanged = async ({viewableItems, index}) => {
      if (viewableItems.length !=0) {
        setTabIndex(viewableItems[0].index)
      } else {
        setBottomBarElements({})
      }
      //setBottomBarElements(viewableItems[0]?.item.bottomBarElements)
    }

  let canChangeBar=true

  const onProgressChange = (offsetProgress, absoluteProgress) => {
    if (Math.round(absoluteProgress) >= screens.length) absoluteProgress=absoluteProgress-screens.length;
    scrollViewX.value = absoluteProgress*SCREEN_WIDTH;
    if (Math.abs(0.25-absoluteProgress%0.5) < 0.15) {
      canChangeBar=true;
      return;
    }
    if (tabIndex != Math.round(absoluteProgress) && canChangeBar) {
      canChangeBar = false;
      setTabIndex(Math.round(absoluteProgress))
    }
  }

  const onSnapToItem = (index) => {
    console.log(index)
    //setTabIndex(index)
  }

  console.log(SCREEN_SNAP_INTERVAL, scrollViewX.value)

  return (
    <View style={[
      styles.container
    ]}>
      <View onStartShouldSetResponder={(e) => {
        if (expanded) setExpanded(false)
        return expanded;
      }}>
      <Animated.View
        style={[
          styles.tabContainer, 
          animatedHeaderTransformStyle,
          {width: SCREEN_WIDTH*screenCnt}
        ]}
      >
          {/* <HeaderItem
            key={screens.length-1}
            item={screens[screens.length-1]}
            index={screens.length-1}
            onPress={onTabPress}
            maxLen={screens.length}
            scrollViewX={scrollViewX}
            onLayout={(event) => onHeaderLayout(screens.length-1, event)}
            screenSnapInterval={SCREEN_SNAP_INTERVAL}
          /> */}
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
          <HeaderItem
            key={0}
            item={screens[0]}
            index={0}
            onPress={onTabPress}
            maxLen={screens.length}
            scrollViewX={scrollViewX}
            onLayout={(event) => onHeaderLayout(0, event)}
            screenSnapInterval={SCREEN_SNAP_INTERVAL}
          />
          <HeaderItem
            key={1}
            item={screens[1]}
            index={1}
            onPress={onTabPress}
            maxLen={screens.length}
            scrollViewX={scrollViewX}
            onLayout={(event) => onHeaderLayout(1, event)}
            screenSnapInterval={SCREEN_SNAP_INTERVAL}
          />
      </Animated.View>

      <bottomBarContext.Provider value={setBottomBarElements}>
      {/* <Animated.FlatList
        horizontal
        bounces={true}
        ref={animatedRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        pagingEnabled={true}
        snapToAlignment={'start'}
        decelerationRate={0.825}
        overScrollMode={'never'}
        snapToInterval={SCREEN_SNAP_INTERVAL}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.screenList}
        disableIntervalMomentum={true}

        viewabilityConfig={{itemVisiblePercentThreshold: 60}}
        onViewableItemsChanged={onViewableItemsChanged}
        
        data={screens}
        renderItem={listItem}
      /> */}
      <Carousel
        loop
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT-175}
        //onSnapToItem={onViewableItemsChanged}
        onProgressChange={onProgressChange}
        onScrollEnd={onSnapToItem}
        pagingEnabled={true}
        ref={ref}
        //ref={animatedRef}
        //onProgressChange={scrollHandler}
        
        data={screens}
        renderItem={listItem}

      />

      </bottomBarContext.Provider>
      </View>
      {/* <View ref={bottomRef}>
        {bottomBar}
      </View> */}
      {bottomBar && (
        <CombinedBar expanded = {expanded} setExpanded={setExpanded} {...bottomBarElements}/>
      )}
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