import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Home, Matches, Messages, MyProfile } from "./screens";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  AnimatedTabBarNavigator,
  DotSize,
  TabElementDisplayOptions,
} from "react-native-animated-nav-tab-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { Provider, useAtom } from "jotai";
import { phoneLocationAtom } from "./atoms/currentLocationAtom";
import { auth, db } from "./firebaseConfig";
import LoginScreen from "./screens/LoginScreen";
import EditProfile from "./screens/EditProfile";
import { userAtom } from "./atoms/userAtom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { LogBox, SafeAreaView, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// const Tabs = AnimatedTabBarNavigator();
const Tabs = createBottomTabNavigator();

LogBox.ignoreAllLogs(); // Suppress all logs on phone

const TabBarIcon = (props) => (
  <Icon
    name={props.name}
    size={props.size ? props.size : 24}
    color={props.tintColor}
  />
);

const App = () => {
  const [user, setUser] = useAtom(userAtom);
  const [userList, setUserList] = useState([]);
  const navigationRef = useRef();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getUsers = async (userID) => {
      try {
        const q = query(collection(db, "Users"), where("userId", "==", userID));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map((doc) => doc.data());
        setUserList(usersList);
        if (usersList.length === 0 && navigationRef.current) {
          navigationRef.current.navigate("EditProfile");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (user) {
      getUsers(user.uid);
    }
  }, [user]);

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavigationContainer ref={navigationRef}>
          <GestureHandlerRootView>
            <Tabs.Navigator
              initialRouteName="Home"
              screenOptions={({ route }) => ({
                tabBarStyle: {
                  display: route.name === "EditProfile" ? "none" : "flex",
                },
                headerShown: false,
                tabBarActiveTintColor: "#1cb8c4",
                tabBarInactiveTintColor: "#223322",
              })}
              // screenOptions={{
              //   headerShown: false,
              //   tabBarActiveTintColor: "#1cb8c4",
              //   tabBarInactiveTintColor: "#223322",

              //   // tabBarActiveBackgroundColor: "#1cb8c4",
              // }}
              // tabBarOptions={{
              //   activeTintColor: "#eee",
              //   inactiveTintColor: "#223322",
              //   activeBackgroundColor: "#1cb8c4",
              // }}
              // appearance={{
              //   shadow: true,
              //   floating: false,
              //   whenActiveShow: TabElementDisplayOptions.BOTH,
              //   dotSize: DotSize.SMALL,
              // }}
            >
              {user ? (
                <>
                  <Tabs.Screen
                    name="Home"
                    component={Home}
                    options={{
                      tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon
                          focused={focused}
                          tintColor={color}
                          name="home"
                        />
                      ),
                      tabBarShowLabel: false,
                    }}
                  />
                  <Tabs.Screen
                    name="Matches"
                    component={Matches}
                    options={{
                      tabBarShowLabel: false,
                      tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon
                          focused={focused}
                          tintColor={color}
                          name="heart"
                        />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    name="Chat"
                    component={Messages}
                    options={{
                      tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon
                          focused={focused}
                          tintColor={color}
                          name="chat"
                        />
                      ),
                      tabBarShowLabel: false,
                    }}
                  />
                  <Tabs.Screen
                    name="Profile"
                    component={MyProfile}
                    options={{
                      tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon
                          focused={focused}
                          tintColor={color}
                          name="account"
                        />
                      ),
                      tabBarShowLabel: false,
                    }}
                  />

                  <Tabs.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={{
                      tabBarStyle: { display: "none" },
                      tabBarButton: () => null, // This hides the tab button
                    }}
                  />
                </>
              ) : (
                <>
                  <Tabs.Screen
                    name="Home"
                    component={Home}
                    options={{
                      tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon
                          focused={focused}
                          tintColor={color}
                          name="home"
                        />
                      ),
                      tabBarShowLabel: false,
                    }}
                  />
                  <Tabs.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                      tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon
                          focused={focused}
                          tintColor={color}
                          name="lock"
                        />
                      ),
                      tabBarShowLabel: false,
                    }}
                  />
                </>
              )}
            </Tabs.Navigator>
          </GestureHandlerRootView>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
};

export default App;
