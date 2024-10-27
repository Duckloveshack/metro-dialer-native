import { View } from "react-native";
import * as Animatable from "react-native-animatable"

const MetroView = (props) => {
    const rotateIn = {
        0: {
            transform: 'rotateY("70deg") translateX("-100%")',
            opacity: 0
        },
        1: {
            opacity: 1
        }
    }

    return (
        <Animatable.View {...props}  easing="ease-out" animation={rotateIn}/>
    )
}

export default MetroView;