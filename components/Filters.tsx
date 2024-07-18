import React, { RefObject } from "react";
import { Text, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import styles, { DARK_GRAY } from "../assets/styles";
import BottomSheet from "@gorhom/bottom-sheet";

interface FilterProps {
  filterSheetRef: RefObject<BottomSheet>;
}

const Filters: React.FC<FilterProps> = ({ filterSheetRef }) => (
  <TouchableOpacity
    style={styles.filters}
    onPress={() => filterSheetRef.current?.expand()}
  >
    <Text style={styles.filtersText}>
      <Icon name="filter" size={13} color={DARK_GRAY} /> Filters
    </Text>
  </TouchableOpacity>
);

export default Filters;
