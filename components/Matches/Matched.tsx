import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import CardItem from "../CardItem";
import DEMO from "../../assets/data/demo";
import CardItemBlocked from "../CardItemBlocked";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import CardItemMatched from "../CardItemMatched";

export default function Matched() {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const fetchMatches = async () => {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      console.log("User is not signed in");
      return [];
    }

    try {
      const q1 = query(
        collection(db, "Matches"),
        where("user1", "==", currentUserUid)
      );
      const q2 = query(
        collection(db, "Matches"),
        where("user2", "==", currentUserUid)
      );

      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2),
      ]);

      const matches = [
        ...querySnapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...querySnapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ];

      const matchedUserIds = matches.map((match) => ({
        matchId: match.id,
        userId: match.user1 === currentUserUid ? match.user2 : match.user1,
      }));

      return matchedUserIds;
    } catch (error) {
      console.error("Error fetching matches:", error);
      return [];
    }
  };

  const fetchUserProfiles = async (matches) => {
    const userIds = matches.map((match) => match.userId);
    if (userIds.length === 0) return [];

    try {
      const q = query(
        collection(db, "Users"),
        where("__name__", "in", userIds)
      );
      const querySnapshot = await getDocs(q);

      const profiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        matchId: matches.find((match) => match.userId === doc.id).matchId,
      }));
      return profiles;
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      return [];
    }
  };

  const fetchMatchedUserProfiles = async () => {
    const matchedUserIds = await fetchMatches();
    const matchedUserProfiles = await fetchUserProfiles(matchedUserIds);
    setMatchedUsers(matchedUserProfiles);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMatchedUserProfiles();
  }, []);

  return (
    <View>
      <FlatList
        numColumns={1}
        data={matchedUsers}
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
            <Text>No Matched Users</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity>
            <CardItemMatched
              matchId={item.matchId}
              userid={item.id}
              image={item.Pictures}
              name={item.UserName}
              isOnline={item.isOnline}
              hasVariant
            />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchMatchedUserProfiles}
          />
        }
      />
    </View>
  );
}
