import React, { RefObject, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./Icon";
import styles, { DARK_GRAY } from "../assets/styles";
import CustomBottomSheet from "./HomeLocation";
import BottomSheet from "@gorhom/bottom-sheet";

interface CityProps {
  bottomSheetRef: RefObject<BottomSheet>;
  title: string;
}

const City: React.FC<CityProps> = ({ bottomSheetRef, title }) => (
  <TouchableOpacity
    style={styles.city}
    onPress={() => bottomSheetRef.current?.expand()}
  >
    <Text style={styles.cityText} numberOfLines={1} ellipsizeMode="tail">
      <Icon name="location-sharp" size={13} color={DARK_GRAY} /> {title}
    </Text>
  </TouchableOpacity>
);

export default City;
