import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchMatchesWithLastMessages } from "../../helpers";
import Icon from "../Icon";

export default function MessageList() {
  const [matches, setMatches] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getMatches = async () => {
      const matchesWithLastMessages = await fetchMatchesWithLastMessages();
      setMatches(matchesWithLastMessages);
    };

    getMatches();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.matchItem}
            onPress={() =>
              navigation.navigate("MessageDetail", {
                matchId: item.matchId,
                userName: item.UserName,
              })
            }
          >
            <View style={styles.profilePicContainer}>
              <Image
                source={{ uri: item.Pictures }}
                style={styles.profilePic}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.userName}>{item.UserName}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No Matches Found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  matchItem: {
    flexDirection: "row",
    padding: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profilePicContainer: {
    marginRight: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
  },
});
