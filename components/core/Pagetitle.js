import { Text } from "react-native"
import { fonts } from "../../styles/fonts"
import { MetroTheme } from "../../styles/theme"

export const PageTitle = ({title, isUpperCase=false}) => {
    return (
        <Text className={`text-5xl mt-5 ${isUpperCase ? "" : "lowercase"}`} style={[fonts.light, {color: MetroTheme.active}]}>
            {title} 
        </Text>
    )
}