import React, { useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";

const data = [
  { label: "none", value: "none" },
  { label: "Caucasian", value: "Caucasian" },
  { label: "Black", value: "Black" },
  { label: "Middle Eastern", value: "Middle Eastern" },
  { label: "North African", value: "North African" },
  { label: "Latin American", value: "Latin American" },
  { label: "mixed", value: "mixed" },
  { label: "Asian", value: "Asian" },
  { label: "Other", value: "Other" },
];

const EthnicityDropdown = () => {
  const [value, setValue] = useState<string>();
  const ref = useRef<IDropdownRef>(null);

  return (
    <View style={styles.row}>
      <Dropdown
        ref={ref}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Ethnicity"
        searchPlaceholder="Search..."
        value={value}
        closeModalWhenSelectedItem={false}
        onChange={(item) => {
          setValue(item.value);
        }}
        onChangeText={() => {}} // Keep search keyword
      />
    </View>
  );
};

export default EthnicityDropdown;

const styles = StyleSheet.create({
  row: {
    padding: 16,
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
    fontSize: 16,
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
});
