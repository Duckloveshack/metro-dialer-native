import { View , StyleSheet, Dimensions, ScrollView } from "react-native"
import { AppTitle } from "../components/core/AppTitle"
import { PageTitle } from "../components/core/Pagetitle";
import ToggleSwitch from "../components/core/ToggleSwitch";
import { SettingsText } from "../components/core/SettingsText";
import { Select } from "../components/core/Select";
import { SettingsSwitch } from "../components/core/SettingsSwitch";
import Button from "../components/core/Button";
import Modal from "../components/core/MetroModal";
import MetroModal from "../components/core/MetroModal";
import { useState } from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const SettingsMain = ({ navigation }) => {
    const [modal, setModal] = useState(false)

    return (
        <View style={styles.container}>
            <MetroModal
              title="Something went wrong..."
              description="these alerts kinda suck"
              visible={modal}
              buttons={[
                {
                  label: "test",
                  onPress: () => {
                    setModal(false)
                  }
                },
                {
                  label: "test 2",
                  onPress: () => {
                    setModal(false)
                  }
                }
              ]}
            />
            <AppTitle title="SETTINGS (nothing works)"/>
            <View style={styles.screenContainer}>
                <PageTitle title="phone"/>
                <ScrollView overScrollMode="always" contentContainerStyle={styles.tabContainer}>
                    <SettingsText key={0} classOverride={"mb-4"} title="My phone number">+1 (425) 001-0001</SettingsText>
                    <SettingsSwitch isOn={false} title={"Use Dialer as the default phone app"} classOverride={"mb-4"}/>
                      <Select key={3} disabled={false} classOverride={"mb-4"} defaultOption="2" title="Theme" options={[
                        { name: "system", value: "system" },
                        { name: "light", value: "light" },
                        { name: "dark", value: "dark" }
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