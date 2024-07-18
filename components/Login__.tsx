import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "./Icon";
import { TextInput } from "react-native-gesture-handler";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { firebaseConfig } from "../firebaseConfig";
// import { signInWithPhoneNumber } from "@firebase/auth";
import auth from "@react-native-firebase/auth";

export const DIMENSION_WIDTH = Dimensions.get("window").width;
export const DIMENSION_HEIGHT = Dimensions.get("window").height;

export default function Login({ onNavigateToOTP }) {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState("815502826");
  const recaptchaVerifier = useRef(null);

  // Fetch country code
  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then((response) => response.json())
      .then((data) => {
        let areaData = data.map((item) => {
          return {
            code: item.alpha2Code,
            item: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: "https://flagsapi.com/" + item.alpha2Code + "/flat/64.png",
          };
        });
        setAreas(areaData);

        if (areaData.length > 0) {
          let defaultData = areaData.filter((a) => a.code === "ZA");
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, []);

  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const handleSendCode = async () => {
    let phoneNumber = selectedArea?.callingCode + number;

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      onNavigateToOTP(confirmation);
    } catch (error) {}
  };

  const renderAreasCodeModal = () => {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        key={item.code}
        style={styles.areaItem}
        onPress={() => {
          setSelectedArea(item);
          setModalVisible(false);
        }}
      >
        <Image source={{ uri: item.flag }} style={styles.flagIcon} />
        <Text style={styles.areaText}>
          {item.item} ({item.callingCode})
        </Text>
      </TouchableOpacity>
    );

    return (
      <Modal
        animationType="fade"
        transparent={true}
        style={{ flex: 1, width: "100%" }}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Select Country Code</Text>
            <FlatList
              data={areas}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
              style={styles.flatList}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      <StatusBar hidden />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Image
            source={require("../assets/icon.png")}
            resizeMode="contain"
            style={styles.secureLogin}
          />
          <View style={styles.inputWrapper}>
            <View>
              <Text style={styles.title}>Enter Your Phone Number</Text>
              <Text style={styles.subtitle}>
                We will send you a verification code
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.selectFlagContainer}
                onPress={() => setModalVisible(true)}
              >
                <Icon name="chevron-down-outline" size={10} color="#222" />
                {selectedArea?.flag && (
                  <Image
                    source={{ uri: selectedArea.flag }}
                    resizeMode="contain"
                    style={styles.flagIcon}
                  />
                )}
                <Text style={styles.callingCode}>
                  {selectedArea?.callingCode || "+1"}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={"#222"}
                selectionColor={"#222"}
                autoCorrect={false}
                value={number}
                onChangeText={(text) => setNumber(text)}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleSendCode}>
              <Text style={styles.btnText}>Verify</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.termsText}>
              By continuing you agree with our Terms of Service and Privacy
              Policy
            </Text>
            <Text style={styles.termsLink}>
              Terms of Service and Privacy Policy
            </Text>
          </View>
          {renderAreasCodeModal()}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 6,
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: 50,
  },
  secureLogin: {
    width: WINDOW_WIDTH * 0.4,
    height: WINDOW_HEIGHT * 0.4,
  },
  inputWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#222",
    borderBottomWidth: 0.4,
    width: "80%",
    height: 40,
    marginVertical: 16,
  },
  selectFlagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  callingCode: {
    fontSize: 12,
    color: "#222",
    marginLeft: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#222",
  },
  btn: {
    width: "80%",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1cb8c4",
  },
  btnText: {
    color: "white",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  termsText: {
    fontSize: 11,
    textAlign: "center",
  },
  termsLink: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    flex: 1,
    width: DIMENSION_WIDTH,
    maxHeight: DIMENSION_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 50,
    width: DIMENSION_WIDTH,
    maxHeight: DIMENSION_HEIGHT,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  flatList: {
    width: "100%",
  },
  areaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  areaText: {
    paddingHorizontal: 20,
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
});
