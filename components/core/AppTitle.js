import { Text, StyleSheet } from "react-native"
import { fonts } from "../../styles/fonts"
import { MetroTheme } from "../../styles/theme"

export const AppTitle = ({title}) => {
    return (
        <Text style={[fonts.regular, styles.appTitleText]}>
            {title}
        </Text>
    )
}

const styles = StyleSheet.create({
    appTitleText: {
    marginStart: 10,
    marginTop: 2,
    // paddingLeft: 10,
    fontSize: 14,
    color: MetroTheme.active,
    fontWeight: "bold",
    }
})