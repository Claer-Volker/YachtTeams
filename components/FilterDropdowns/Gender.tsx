import React, { useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";

const data = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const Gender = () => {
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
        placeholder="Gender"
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

export default Gender;

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
