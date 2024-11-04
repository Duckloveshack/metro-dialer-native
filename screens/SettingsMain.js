import { View , StyleSheet, Dimensions, ScrollView } from "react-native"
import { AppTitle } from "../components/core/AppTitle"
import { PageTitle } from "../components/core/Pagetitle";
import ToggleSwitch from "../components/core/ToggleSwitch";
import { SettingsText } from "../components/core/SettingsText";
import { Select } from "../components/core/Select";
import { SettingsSwitch } from "../components/core/SettingsSwitch";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const SettingsMain = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <AppTitle title="SETTINGS"/>
            <View style={styles.screenContainer}>
                <PageTitle title="phone"/>
                <ScrollView overScrollMode="always" contentContainerStyle={styles.tabContainer}>
                    <SettingsText key={0} classOverride={"mb-4"} title="My phone number">+1 (425) 001-0001</SettingsText>
                    <SettingsSwitch key={1} classOverride={"mb-4"} isOn={true} title="Use default voicemail number"/>
                    <Select key={2} classOverride={"mb-4"} title="Show my caller ID to" options={[
                        { name: "everyone", value: "all" },
                        { name: "no one", value: "none" },
                        { name: "my contacts", value: "contacts" }
                    ]} onChange={() => {}}/>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 0, //120
      backgroundColor: "black"
    },
    screenContainer: {
      height: "100%", // account for container padding top (120 original)
      padding: 6
    },
    tabContainer: {
      flexDirection: "column",
      backgroundColor: "black",
      marginTop: 16,
      padding: 6,
    },
    tabText: {
      paddingRight: 10,
      paddingLeft: 10,
      fontSize: 50,
    },
  });

export default SettingsMain;