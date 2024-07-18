import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";

const data = [
  { label: "none", value: "none" },
  { label: "Slim", value: "Slim" },
  { label: "Athletic/Fit", value: "Athletic/Fit" },
  { label: "Curvy", value: "Curvy" },
  { label: "Average", value: "Average" },
  { label: "Plus Size", value: "Plus Size" },
  { label: "Muscular", value: "Muscular" },
];

const BodyTypeDropdown = ({
  initialValue,
  onBodyTypeChange,
}: {
  initialValue: string;
  onBodyTypeChange: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>();
  const ref = useRef<IDropdownRef>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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
        placeholder="Body Type"
        searchPlaceholder="Search..."
        value={value}
        closeModalWhenSelectedItem={true}
        onChange={(item) => {
          onBodyTypeChange(item.value);
          setValue(item.value);
        }}
        onChangeText={() => {}} // Keep search keyword
      />
    </View>
  );
};

export default BodyTypeDropdown;

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
