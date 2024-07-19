import React, { useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Icon, Message } from "../components";
import DEMO from "../assets/data/demo";
import styles, { DARK_GRAY } from "../assets/styles";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageList from "../components/Messages/MessageList";
import MessageDetail from "../components/Messages/MessageDetail";
import { useNavigation, useRoute } from "@react-navigation/native";

const MatchesStack = createNativeStackNavigator();

const Messages = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { matchId, userName } = route?.params || {};

  useEffect(() => {
    console.log("Messages");

    if (matchId === undefined) {
      navigation.navigate("Messages");
    } else {
      navigation.navigate("MessagePage", {
        matchId: matchId,
        userName: userName,
      });
    }
  }, [matchId]);

  return (
    <SafeAreaView style={styles.bg}>
      <MatchesStack.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            display: route.name === "EditProfile" ? "none" : "flex",
          },
          headerShown: false,
          tabBarActiveTintColor: "#1cb8c4",
          tabBarInactiveTintColor: "#223322",
        })}
      >
        <MatchesStack.Screen name="Messages" component={MessageList} />
        <MatchesStack.Screen name="MessagePage" component={MessageDetail} />
      </MatchesStack.Navigator>
    </SafeAreaView>
  );
};

export default Messages;
