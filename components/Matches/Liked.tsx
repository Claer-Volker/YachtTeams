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
import CardItemLiked from "../CardItemLiked";

export default function Liked() {
  const [likedUsers, setLikedUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const fetchUsersYouLiked = async () => {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      console.log("User is not signed in");
      return [];
    }

    try {
      const q = query(
        collection(db, "Likes"),
        where("liker", "==", currentUserUid)
      );
      const querySnapshot = await getDocs(q);

      const usersYouLiked = querySnapshot.docs.map((doc) => doc.data().liked);
      return usersYouLiked;
    } catch (error) {
      console.error("Error fetching users you liked:", error);
      return [];
    }
  };

  const fetchUsersWhoLikedYou = async () => {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      console.log("User is not signed in");
      return [];
    }

    try {
      const q = query(
        collection(db, "Likes"),
        where("liked", "==", currentUserUid)
      );
      const querySnapshot = await getDocs(q);

      const usersWhoLikedYou = querySnapshot.docs.map(
        (doc) => doc.data().liker
      );
      return usersWhoLikedYou;
    } catch (error) {
      console.error("Error fetching users who liked you:", error);
      return [];
    }
  };

  const fetchUnreciprocatedLikes = async () => {
    const usersYouLiked = await fetchUsersYouLiked();
    const usersWhoLikedYou = await fetchUsersWhoLikedYou();

    const unreciprocatedLikes = usersYouLiked.filter(
      (userId) => !usersWhoLikedYou.includes(userId)
    );
    return unreciprocatedLikes;
  };

  const fetchUserProfiles = async (userIds) => {
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
      }));
      return profiles;
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      return [];
    }
  };

  const fetchUnreciprocatedUserProfiles = async () => {
    const unreciprocatedUserIds = await fetchUnreciprocatedLikes();
    const unreciprocatedUserProfiles = await fetchUserProfiles(
      unreciprocatedUserIds
    );
    console.log(unreciprocatedUserProfiles);
    setLikedUsers(unreciprocatedUserProfiles);
  };

  useEffect(() => {
    fetchUnreciprocatedUserProfiles();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        numColumns={1}
        data={likedUsers}
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
            <Text>No Liked Users</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity>
            <CardItemLiked
              userid={item?.userId}
              image={item?.Pictures[0]}
              name={item?.UserName}
              isOnline={item?.isOnline}
              hasVariant
            />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchUnreciprocatedUserProfiles}
          />
        }
      />
    </View>
  );
}
