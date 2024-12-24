import { useRef, useState } from "react";
import { Touchable, TouchableWithoutFeedback, View, Text } from "react-native"
import Animated, { useSharedValue } from "react-native-reanimated"
import * as Animatable from "react-native-animatable"
import { fonts } from "../../styles/fonts";

const SIMSwitch = ({

}) => {
    const [sim, setSim] = useState(0);
    const simsRef = useRef();

    const [switchProps, setSwitchProps] = useState({
        width: 0,
        height: 0
    })
    
    const switchWidth = useSharedValue(0);
    const switchHeight = useSharedValue(0)

    const sims = [
        {
            color: "#a013ec"
        },
        {
            color: "#fa6800"
        },
        {
            color: "#f0a30a"
        }
    ];

    const onLayout = (e) => {
        setSwitchProps({
            width: e.nativeEvent.layout.width / sims.length,
            height: e.nativeEvent.layout.height
        })
    }

    return (
        <View
            style={{
                marginLeft: "auto"
            }}
        >
            <Animatable.View
                transition={"left"}
                duration={100}
                style={{
                    position: "absolute",
                    backgroundColor: sims[sim].color,
                    width: switchProps.width,
                    height: switchProps.height,
                    left: sim*switchProps.width
                }}
            />
            <View
                style={{
                    flexDirection: "row",
                    zIndex: 2
                }}
                ref={simsRef}
                onLayout={onLayout}
            >
                {sims.map((item, index) => {
                    
                    return (
                        <TouchableWithoutFeedback
                            onPress={() => {setSim(index)}}
                            style={{
                                flex: 1
                            }}
                        >
                            <View
                                style={{
                                    borderColor: ( sim === index )? "#ffffff00": "#383838",
                                    borderWidth: 2,
                                    borderRightWidth: ( index !== sims.length-1 )? 0: 2,
                                    paddingHorizontal: 15,
                                    paddingVertical: 4
                                }}
                            >
                                <Text style={[fonts.regular, { color: ( sim == index )? "#ffffff": "#383838" }]} className="text-s">{index+1}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })}
            </View>
        </View>
    )
}

export default SIMSwitch