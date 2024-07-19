import React, { useEffect, useState } from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import { CardItemT } from "../types";
import styles, {
  DARK_GRAY,
  DISLIKE_ACTIONS,
  FLASH_ACTIONS,
  LIKE_ACTIONS,
  STAR_ACTIONS,
  WHITE,
} from "../assets/styles";
import { phoneLocationAtom } from "../atoms/currentLocationAtom";
import { useAtom } from "jotai";
import LoadingDots from "react-native-loading-dots";
import { auth, db } from "../firebaseConfig";
import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const CardItemMatched = ({
  matchId,
  description,
  hasActions,
  hasVariant,
  image,
  isOnline,
  matches,
  name,
  userid,
  location,
}: CardItemT) => {
  // Custom styling
  const fullWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const imageStyle = [
    {
      borderRadius: 8,
      width: "100%",
      height: hasVariant ? 170 : 350,
      margin: hasVariant ? 0 : 20,
    },
  ];

  const nameStyle = [
    {
      color: "#363636",
      fontSize: 10,
    },
  ];

  const unignoreProfile = async (profileUid) => {
    try {
      const currentUserUid = auth.currentUser?.uid;
      if (!currentUserUid) {
        console.log("User is not signed in");
        return;
      }
      const userRef = doc(db, "Users", profileUid); // Assuming userID is the document ID
      await updateDoc(userRef, {
        ignored: arrayRemove(currentUserUid),
      });
      console.log(`User ${profileUid} unignored by ${currentUserUid}`);
    } catch (error) {
      console.error("Error unignoring profile:", error);
      // Handle errors as needed
    }
  };

  return (
    <View style={styles.containerCardItem}>
      {/* IMAGE */}
      <Image source={{ uri: image }} style={imageStyle} />

      {/* MATCHES */}

      <View style={styles.matchesCardItem}>
        <Text style={styles.matchesTextCardItem}>{name}</Text>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <TouchableOpacity
          style={styles.roundedButton}
          onPress={() =>
            navigation.navigate("Chat", {
              matchId matchId,
              userName: name,
            })
          }
        >
          <Icon name="chatbubble" size={20} color={WHITE} />
          <Text style={styles.textButton}>Start chatting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardItemMatched;
