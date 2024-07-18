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
import CardItemFav from "../CardItemFav";

export default function Favourites() {
  const [ignoredUsers, setIgnoredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  async function fetchIgnoredUsers(usersRef, userID) {
    const q = query(usersRef, where("favoritedBy", "array-contains", userID));
    const querySnapshot = await getDocs(q);

    // const data[]
    // querySnapshot.forEach((doc) => {

    //     console.log(doc.id, " => ", doc.data());
    //   });

    const blockedList: any[] = [];

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      blockedList.push(doc.data()); //
    });
    setIgnoredUsers(blockedList);

    // const data = querySnapshot.docs.map((doc) => doc.data());
    // if (data.length !== 0) {
    //   setIgnoredUsers(data);
    // }
  }

  async function getUsers() {
    const usersRef = collection(db, "Users");
    const userID = auth.currentUser?.uid;
    fetchIgnoredUsers(usersRef, userID);
    setRefreshing(false);
  }

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <View>
      <FlatList
        numColumns={1}
        data={ignoredUsers}
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
            <Text>No Favorites</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity>
            <CardItemFav
              userid={item?.userId}
              image={item?.Pictures}
              name={item?.UserName}
              isOnline={item?.isOnline}
              hasVariant
            />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getUsers} />
        }
      />
    </View>
  );
}
