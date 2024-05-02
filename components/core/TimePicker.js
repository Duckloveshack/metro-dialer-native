import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, FlatList }  from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

/* Default values */
const SQUARE_HEIGHT = 80;
const SQUARE_MARGIN = 4;
const BORDER_WIDTH = 4;
const SQUARE_COUNT = 3; /* Must be odd number */

const SELECTION_COLOR     = "orange";
const ACTIVE_TEXT_COLOR   = "white";
const INACTIVE_TEXT_COLOR = "grey";


const TimePicker = ({ 
  values,
  unit = "",
  onValueChange ,
  initialSelectedIndex = 0,
  selectionColor = SELECTION_COLOR, 
  activeTextColor = ACTIVE_TEXT_COLOR, 
  inactiveTextColor = INACTIVE_TEXT_COLOR, 
  squareCount = SQUARE_COUNT,
  squareDimension = {
    height: SQUARE_HEIGHT,
    margin: SQUARE_MARGIN,
    borderWidth: BORDER_WIDTH,
  },
}) => {
  const [activeID, setActiveID] = useState(initialSelectedIndex);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const flatListRef = useRef(null);

  if (!(squareCount & 1)) ++squareCount;
  const SQUARE_HEIGHT_WITH_MARGIN = (squareDimension.height + squareDimension.margin*2);
  const CONTAINER_MAX_HEIGHT = SQUARE_HEIGHT_WITH_MARGIN * squareCount;
  const CONTAINER_MIN_HEIGHT = SQUARE_HEIGHT_WITH_MARGIN;

  const styles = StyleSheet.create({
    flatList: {
      flexGrow: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      // height: CONTAINER_MIN_HEIGHT,
      marginTop: 0, /*-15*/
    },
    square: {
      width: squareDimension.height,
      height: squareDimension.height,
      margin: squareDimension.margin,
    },
    container: {
      // backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      height: CONTAINER_MAX_HEIGHT, /*CONTAINER_MAX_HEIGHT-30*/
    },
    subText: {
      fontSize: 16    ,
      textAlign: "right",
      marginTop: 46,
      marginRight: 7,
      color: activeTextColor,
    },
    linearGradient: {
      flex: 1,
      width: '100%',
    },
  });

  const padValues = (values, selectedIndex) => {
    let index = 0;
    const data = [];

    // Adding top fake squares so the top-most value can be scrolled to the middle
    let i = 1;
    for (let j = 0; j < Math.floor(squareCount/2); ++j)
    {
        data.push({id: -i, text: '', state: false});
        ++i;
    }

    for (let i = 0; i < values.length; i++) {
      const item = {
        index: index++,
        text: String(values[i]),
        state: i === selectedIndex
      };    
      data.push(item);
    }

    // Adding bottom fake squares so the bottom-most value can be scrolled to the middle
    for (let j = 0; j < Math.floor(squareCount/2); ++j)
    {
        data.push({id: -i, text: '', state: false});
        ++i;
    }

    return data;
  };

  const [flatListData, setFlatListData] = useState(padValues(values, initialSelectedIndex));

  useEffect(() => {
    
  }, [activeID])

  // scroll end handlers don't fire when touching on square causes the scrolling
  // So, we call onValueChange() here too
  const touchHandler = (item) => {
    onValueChange(item.index, item.text); /* index and value */
  }


  const scrollHandler = (event) => {
    // Should I move everything to scrollEndHandler for performance reasons?
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
    const topID = Math.round(offsetY / SQUARE_HEIGHT_WITH_MARGIN);
    const centerID = topID + Math.floor(squareCount/2);
    if (centerID != activeID && topID < values.length)
    {
      flatListData[activeID].state = false;
      flatListData[centerID].state = true;
      setActiveID(centerID);
    }
  }

  // FIX: isScrolling is not updating to `true` when touching on Square causes the scrolling.
  // scrollBeginHandler and endHandlers are not firing during this time. There is no work-around
  const scrollBeginHandler = (event) => {
    setIsScrolling(true);
    /* Uncomment to use expand/collapse feature. Incomplete */
    // setExpanded(true);
  }

  const scrollEndHandler = (event) => {
    setIsScrolling(false);
  }

  const momentumScrollEndHandler = (event) => {
    onValueChange(flatListData[activeID].index, flatListData[activeID].text); /* index and value */

    /* Uncomment to use expand/collapse feature. Incomplete */
    // setExpanded(false);
  }

  const renderSquare = ({ item }) => {
    return (
      <Square
        item={item}
        onTouch={touchHandler}
        activeTextColor={activeTextColor}
        inactiveTextColor={inactiveTextColor}
        flatListRef={flatListRef}
        setExpand={setExpanded}
        scrollY={scrollY}
        isScrolling={isScrolling}
        dimension={squareDimension}
      />
    );
  }

  /* TODO: Collapse/expand list. 
    Try uncommenting setExpanded() lines to see the problem :( 
    expanded is always true for now*/
  if (expanded) {
    
    return (
        <MaskedView
            style={styles.container}
            maskElement={
            <View style={{ backgroundColor: 'transparent', flex: 1, }}>
                <LinearGradient colors={['#FFFFFF00', '#FFFFFFFF', '#FFFFFFFF', '#FFFFFFFF', '#FFFFFF00']} 
                style={styles.linearGradient}>
                </LinearGradient>
            </View>
            }
        > 

            {/*Selection highlighter*/}
            <View style={[styles.square, {backgroundColor: selectionColor, position: 'absolute',}]}>
              <Text style={styles.subText}>
                {unit}
              </Text>
            </View>
            
            <FlatList
              ref={flatListRef}
              data={flatListData} 
              renderItem={renderSquare} 
              keyExtractor={(item) => item.index} 
              // decelerationRate={'fast'}
              snapToAlignment={'start'}
              snapToInterval={SQUARE_HEIGHT_WITH_MARGIN}
              contentContainerStyle={styles.flatList}
              onScrollBeginDrag={scrollBeginHandler}
              onScrollEndDrag={scrollEndHandler}
              onMomentumScrollEnd={momentumScrollEndHandler}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              initialNumToRender={squareCount}
              initialScrollIndex={initialSelectedIndex}
              extraData={activeID}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              getItemLayout={(data, index) => ({
                  length: SQUARE_HEIGHT_WITH_MARGIN,
                  offset: SQUARE_HEIGHT_WITH_MARGIN * index,
                  index,
              })}
            />
        </MaskedView>
    );  
  } else {  /* This else will never be satisfied because expanded is always true for now */
    return (
      <View style={styles.container}>
        <View style={[styles.square, 
          {backgroundColor: selectionColor, position: 'absolute'}]}>
        </View>
        <Square style={{position: 'absolute'}}
          item={flatListData[activeID + Math.floor(squareCount/2)]}
          activeTextColor={activeTextColor}
          inactiveTextColor={inactiveTextColor}
          flatListRef={flatListRef}
          setExpand={setExpanded}
          scrollY={scrollY}
        />

      </View>
    );
  }

};



// FIX: isScrolling is not updating to `true` when onTouch() causes the scrolling.
// scrollBeginHandler and endHandlers are not firing during this time. There is no work-around

const Square = ({
    item, 
    activeTextColor, 
    inactiveTextColor, 
    flatListRef,
    setExpand,
    onTouch,
    isScrolling = false,
    dimension,
  }) => {

    const styles = StyleSheet.create({
      square: {
        width: dimension.height,
        height: dimension.height,
        // backgroundColor: "transparent",
        margin: dimension.margin,
      },
      text: {
        fontSize: 40,
        textAlign: "left",
        marginTop: 20,
        marginLeft: 5,
      },
    });

    if (item.text === '') {
      return <View style={[styles.square, { backgroundColor: 'transparent' }]} />;
    }
    
    const border = isScrolling ? dimension.borderWidth : (item.state ? 0 : dimension.borderWidth);
    const textColor = item.state ? activeTextColor : inactiveTextColor;
  
    const pressHandler = () => {
      flatListRef?.current?.scrollToIndex({index: item.index});
      onTouch(item);
      /* Uncomment to use expand/collapse feature. Incomplete */
      // setExpand((prevState) => (!prevState));
    }
  
    return (
      <TouchableWithoutFeedback onPress={pressHandler}>
      <View style={[ 
        styles.square, 
        {borderWidth: border, borderColor: inactiveTextColor} 
      ]}>
        <Text style={[ styles.text, {color: textColor,} ]}>
          {item.text}
        </Text>
      </View>
      </TouchableWithoutFeedback>
    );
  };
  

// <View style={[styles.square, {position: 'absolute'}]}>
//         <Text style={[styles.text, {marginLeft: 20}]}> 69</Text>
//       </View>



export default TimePicker;



