import { View } from "react-native"
import MetroTabs from "../components/core/MetroTabs"
import HistoryScreen from "./HistoryScreen"
import { AppTitle } from "../components/core/AppTitle"
import ContactProfileScreen from "./ContactProfileScreen"
import ContactHistoryScreen from "./ContactHistoryScreen"


const ContactInfoMain = ({
    navigation,
    route,
    data
}) => {
    

    return (
        <View style={{ backgroundColor: "black" }}>
            <AppTitle title={"ACCOUNT NAME"} subtitle={"Microsoft account"}/>
            <MetroTabs
                rightOverlapWidth={0}
                screens={[
                    { key: "0", title: "profile", screen: <ContactProfileScreen navigation={navigation} route={route}/> },
                    { key: "1", title: "history", screen: <ContactHistoryScreen navigation={navigation} route={route}/> },
                ]}
                bottomBar
            />
        </View>
    )
}

export default ContactInfoMain