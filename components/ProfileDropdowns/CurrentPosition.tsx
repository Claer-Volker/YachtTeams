import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  Dropdown,
  IDropdownRef,
  MultiSelect,
} from "react-native-element-dropdown";

const data = [
  //   { label: "Deck", value: "Deck" },
  { label: "Captain", value: "Captain", parent: "Deck" },
  { label: "Captain/Engineer", value: "Captain/Engineer", parent: "Deck" },
  { label: "1st Officer", value: "1st Officer", parent: "Deck" },
  { label: "2nd Officer", value: "2nd Officer", parent: "Deck" },
  { label: "3rd Officer", value: "3rd Officer", parent: "Deck" },
  { label: "Chief Mate", value: "Chief Mate", parent: "Deck" },
  { label: "Mate", value: "Mate", parent: "Deck" },
  { label: "Mate Engineer", value: "Mate Engineer", parent: "Deck" },
  { label: "Mate/Cook", value: "Mate/Cook", parent: "Deck" },
  { label: "Bosun", value: "Bosun", parent: "Deck" },
  { label: "Deckhand", value: "Deckhand", parent: "Deck" },
  //   { label: "Engineering", value: "Engineering" },
  { label: "Chief Engineer", value: "Chief Engineer", parent: "Engineering" },
  { label: "Second Engineer", value: "Second Engineer", parent: "Engineering" },
  { label: "Third Engineer", value: "Third Engineer", parent: "Engineering" },
  { label: "Sole Engineer", value: "Sole Engineer", parent: "Engineering" },
  //   { label: "Galley", value: "Galley" },
  { label: "Chef", value: "Chef", parent: "Galley" },
  { label: "Sous Chef", value: "Sous Chef", parent: "Galley" },
  { label: "Crew Chef", value: "Crew Chef", parent: "Galley" },
  { label: "Chef/Stew", value: "Chef/Stew", parent: "Galley" },
  { label: "Cook", value: "Cook", parent: "Galley" },
  { label: "Cook/Mate", value: "Cook/Mate", parent: "Galley" },
  { label: "Cook/Stew", value: "Cook/Stew", parent: "Galley" },
  //   { label: "Interior", value: "Interior" },
  { label: "Purser", value: "Purser", parent: "Interior" },
  {
    label: "Chief Steward/ess",
    value: "Chief Steward/ess",
    parent: "Interior",
  },
  {
    label: "Senior Steward/ess",
    value: "Senior Steward/ess",
    parent: "Interior",
  },
  { label: "2nd Steward/ess", value: "2nd Steward/ess", parent: "Interior" },
  { label: "3rd Steward/ess", value: "3rd Steward/ess", parent: "Interior" },
  {
    label: "Junior Steward/ess",
    value: "Junior Steward/ess",
    parent: "Interior",
  },
  { label: "Sole Steward/ess", value: "Sole Steward/ess", parent: "Interior" },
  { label: "Steward/ess/Cook", value: "Steward/ess/Cook", parent: "Interior" },
  {
    label: "Steward/ess/Masseuse",
    value: "Steward/ess/Masseuse",
    parent: "Interior",
  },
  { label: "Steward/ess/Deck", value: "Steward/ess/Deck", parent: "Interior" },
  {
    label: "Laundry Steward/ess",
    value: "Laundry Steward/ess",
    parent: "Interior",
  },
  //   { label: "Speciality", value: "Speciality" },
  {
    label: "Helicopter Pilot",
    value: "Helicopter Pilot",
    parent: "Speciality",
  },
  { label: "Dive Instructor", value: "Dive Instructor", parent: "Speciality" },
  { label: "Dive Master", value: "Dive Master", parent: "Speciality" },
  { label: "Medic/Nurse", value: "Medic/Nurse", parent: "Speciality" },
  { label: "Nanny", value: "Nanny", parent: "Speciality" },
  {
    label: "Personal Trainer",
    value: "Personal Trainer",
    parent: "Speciality",
  },
  { label: "Tutor/Teacher", value: "Tutor/Teacher", parent: "Speciality" },
  {
    label: "Fishing Specialist",
    value: "Fishing Specialist",
    parent: "Speciality",
  },
  { label: "Bartender", value: "Bartender", parent: "Speciality" },
  { label: "Masseuse", value: "Masseuse", parent: "Speciality" },
  { label: "Beautician", value: "Beautician", parent: "Speciality" },
  { label: "Hairdresser", value: "Hairdresser", parent: "Speciality" },
];

export default function CurrentPosition() {
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef<IDropdownRef>(null);

  const onSelectAll = (isSelectAll = true) => {
    const selectItem: string[] = [];
    if (isSelectAll) {
      data.map((item) => {
        selectItem.push(item.value);
      });
    }
    setSelected(selectItem);
  };

  const renderSelectAllIcon = () => {
    const isSelectAll = selected.length === data.length;
    return (
      <TouchableOpacity
        style={styles.wrapSelectAll}
        onPress={() => onSelectAll(!isSelectAll)}
      >
        <Text style={styles.txtSelectAll}>
          {isSelectAll ? `UnSelect All` : "Select All"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.row}>
      <MultiSelect
        inside
        inverted
        ref={ref}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        backgroundColor={"rgba(0,0,0,0.2)"}
        search
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Current Position"
        searchPlaceholder="Search..."
        value={selected}
        onChange={(item) => {
          setSelected(item);
        }}
        selectedStyle={styles.selectedStyle}
        flatListProps={{ ListHeaderComponent: renderSelectAllIcon }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
  },
  dropdown: {
    flex: 1,
    height: 50,
    width: 300,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  button: {
    marginHorizontal: 16,
  },
  wrapSelectAll: {
    alignItems: "flex-end",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  txtSelectAll: {
    color: "blue",
  },
  selectedStyle: {
    borderRadius: 12,
  },
});
