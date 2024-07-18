import React from "react";
import { LogBox, SafeAreaView, Text, View } from "react-native";

LogBox.ignoreAllLogs(); // Suppress all logs on phone

const App = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hi</Text>
    </SafeAreaView>
  );
};

export default App;
