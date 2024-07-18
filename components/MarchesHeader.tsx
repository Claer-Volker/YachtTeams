import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function MarchesHeader({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState<string>("Matches");

  useEffect(() => {
    onChange(value); // Call the onChange callback with the new value
    console.log("onChange", value);
  }, [value]);

  const isSelected = (tab: string) => tab === value;

  return (
    <View style={styles.containerHeader}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setValue("Matches")}>
          <Text
            style={[
              styles.tabText,
              isSelected("Matches") && styles.selectedTabText,
            ]}
          >
            Matches
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setValue("Likes")}>
          <Text
            style={[
              styles.tabText,
              isSelected("Likes") && styles.selectedTabText,
            ]}
          >
            Likes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setValue("Favourites")}>
          <Text
            style={[
              styles.tabText,
              isSelected("Favourites") && styles.selectedTabText,
            ]}
          >
            Favourites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setValue("Blocked")}>
          <Text
            style={[
              styles.tabText,
              isSelected("Blocked") && styles.selectedTabText,
            ]}
          >
            Blocked
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 10,
    // backgroundColor: "#222",
  },
  tabContainer: {
    // backgroundColor: "white",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 30,
    height: 40,
  },
  tabText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "black",
  },
  selectedTabText: {
    fontWeight: "bold",
  },
});
