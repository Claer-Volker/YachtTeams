import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { OtpInput } from "react-native-otp-entry";
import { useAtom } from "jotai";
import { userIDAtom } from "../atoms/userAtom";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const WINDOW_WIDTH = Dimensions.get("window").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;

export default function OTPVerification({ confirmation, onNavigateBack }) {
  const [code, setCode] = useState("");
  const [userID, setUserID] = useAtom(userIDAtom);

  const handleVerifyCode = async () => {
    try {
      await confirmation
        .confirm(code)
        .then((result) => {
          const user = result.user;
          console.log("userDeon2", user.uid);
          AsyncStorage.setItem("@UserID", user.uid.toString()); // Ensure user.uid is a string
          AsyncStorage.setItem("@User", JSON.stringify(user));
          setUserID(user.uid);
        })
        .catch((error) => {});
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, padding: 16 }}>
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
                <Text style={styles.title}>Enter Verification Code</Text>
                <Text style={styles.subtitle}>
                  We will send you a verification code
                </Text>
                <View
                  style={{
                    marginVertical: 22,
                    width: WINDOW_WIDTH * 0.8,
                    paddingTop: 20,
                    marginTop: 40,
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <OtpInput
                      numberOfDigits={6}
                      onTextChange={(text) => setCode(text)}
                      value={code}
                      focusStickBlinkingDuration={400}
                      theme={{
                        pinCodeContainerStyle: {
                          backgroundColor: "#fff",

                          borderRadius: 12,
                        },
                      }}
                    />
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          marginTop: 30,
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        Didn't receive a code?
                      </Text>
                      <TouchableOpacity>
                        <Text
                          style={{
                            marginTop: 30,
                            fontSize: 13,
                            marginLeft: 2,
                            fontWeight: "900",
                            color: "#1cb8c4",
                          }}
                        >
                          Resend Code
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={handleVerifyCode}
                    >
                      <Text style={styles.btnText}>Verify</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        marginTop: 20,
                        width: "100%",
                        alignItems: "center",
                      }}
                      onPress={onNavigateBack}
                    >
                      <Text
                        style={{
                          marginTop: 10,
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        back to login
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  secureLogin: {
    width: WINDOW_WIDTH * 0.3,
    height: WINDOW_HEIGHT * 0.3,
  },
  inputWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
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
});
