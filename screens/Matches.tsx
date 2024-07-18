import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  SafeAreaView,
} from "react-native";
import { CardItem, Icon } from "../components";
import DEMO from "../assets/data/demo";
import styles, { DARK_GRAY } from "../assets/styles";
import MarchesHeader from "../components/MarchesHeader";
import Blocked from "../components/Matches/Blocked";
import Favourites from "../components/Matches/Favourites";
import Matched from "../components/Matches/Matched";
import Liked from "../components/Matches/Liked";

const demo2 = [];

const Matches = () => {
  const [value, setValue] = useState<string>("Matches");

  useEffect(() => {
    console.log("value", value);
  }, [value]);

  return (
    <SafeAreaView style={styles.bg}>
      <ImageBackground
        source={require("../assets/images/bg.png")}
        style={styles.bg}
      >
        <View style={styles.containerMatches}>
          {/* <View style={styles.top}>
          <Text style={styles.title}>Matches</Text>
          <TouchableOpacity>
            <Icon name="ellipsis-vertical" color={DARK_GRAY} size={20} />
          </TouchableOpacity>
        </View> */}

          <View
            style={{
              height: 50,
              borderBottomColor: "gray",
              borderBottomWidth: 0.5,
              // backgroundColor: "#222",
            }}
          >
            <MarchesHeader onChange={setValue} />
          </View>
          <View style={{ flex: 1 }}>
            {value === "Matches" && <Matched />}

            {value === "Likes" && <Liked />}

            {value === "Favourites" && <Favourites />}

            {value === "Blocked" && <Blocked />}
          </View>
          {/* <FlatList
            numColumns={2}
            data={demo2}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 500,
                  // backgroundColor: "#000",
                }}
              >
                <Text>No matches</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity>
                <CardItem
                  image={item.image}
                  name={item.name}
                  isOnline={item.isOnline}
                  hasVariant
                />
              </TouchableOpacity>
            )}
          /> */}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Matches;
