import { Text, StyleSheet, View } from "react-native"
import { fonts } from "../../styles/fonts"

export const AppTitle = ({title, subtitle, customSubtitle, children}) => {
    return (
        <View style={styles.container}>
            <View style = {{ marginRight: "auto" }}>
                <Text style={[fonts.regular, styles.appTitleText]}>
                    {title}
                </Text>
                {customSubtitle? (
                    <View style={styles.appSubtitleText}>
                        {customSubtitle}
                    </View>
                ): (
                    <Text style={[fonts.regular, styles.appSubtitleText]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            <View>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        flexDirection: "row"
    },
    appTitleText: {
        marginStart: 10,
        //marginTop: 2,
        // paddingLeft: 10,
        fontSize: 14,
        color: "white",
        fontWeight: "bold",
    },
    appSubtitleText: {
        fontSize: 12,
        marginStart: 10,
        color: "gray"
    }
})