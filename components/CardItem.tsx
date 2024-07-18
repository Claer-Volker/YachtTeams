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
import AnimatedLoader from "react-native-animated-loader";
import LoadingDots from "react-native-loading-dots";

const CardItem = ({
  description,
  hasActions,
  hasVariant,
  image,
  isOnline,
  matches,
  name,
  location,
}: CardItemT) => {
  // Custom styling
  const fullWidth = Dimensions.get("window").width;
  const [phoneLocation, setPhoneLocation] = useAtom(phoneLocationAtom);
  const [cardDistance, setCardDistance] = useState(-1);

  const imageStyle = [
    {
      borderRadius: 8,
      width: hasVariant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: hasVariant ? 170 : 350,
      margin: hasVariant ? 0 : 20,
    },
  ];

  const nameStyle = [
    {
      paddingTop: hasVariant ? 10 : 15,
      paddingBottom: hasVariant ? 5 : 7,
      color: "#363636",
      fontSize: hasVariant ? 15 : 30,
    },
  ];

  function getDistanceFromLatLonInNm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 3440.065; // Radius of the Earth in nautical miles
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in nautical miles
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // useEffect(() => {
  //   try {
  //     if (phoneLocation) {
  //       if (phoneLocation?.latitude && phoneLocation?.longitude) {
  //         const distance = getDistanceFromLatLonInNm(
  //           phoneLocation?.latitude,
  //           phoneLocation?.longitude,
  //           location.latitude,
  //           location.longitude
  //         );
  //         console.log("distance");
  //         console.log(distance);
  //         setCardDistance(Math.round(distance));
  //       } else {
  //         setCardDistance(-1);
  //       }
  //     }
  //   } catch {
  //     console.log("error");
  //   }
  // }, [phoneLocation]);

  return (
    <View style={styles.containerCardItem}>
      {/* IMAGE */}
      <Image source={{ uri: image }} style={imageStyle} />

      {/* MATCHES */}

      <View style={styles.matchesCardItem}>
        {cardDistance >= 0 ? (
          <>
            <Icon name="location" color={WHITE} size={20} />
            <Text style={styles.matchesTextCardItem}>
              {cardDistance} Nautical Miles Away
            </Text>
          </>
        ) : (
          <LoadingDots colors={["#fff", "#fff", "#fff"]} dots={3} size={10} />
        )}
      </View>

      {/* NAME */}
      <Text style={nameStyle}>{name}</Text>

      {/* DESCRIPTION */}
      {description && (
        <Text style={styles.descriptionCardItem}>{description}</Text>
      )}

      {/* STATUS */}
      {!description && (
        <View style={styles.status}>
          <View style={isOnline ? styles.online : styles.offline} />
          <Text style={styles.statusText}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      )}

      {/* ACTIONS */}
      {hasActions && (
        <View style={styles.actionsCardItem}>
          <TouchableOpacity style={styles.miniButton}>
            <Icon name="star" color={STAR_ACTIONS} size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="heart" color={LIKE_ACTIONS} size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="close" color={DISLIKE_ACTIONS} size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.miniButton}>
            <Icon name="flash" color={FLASH_ACTIONS} size={14} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CardItem;
