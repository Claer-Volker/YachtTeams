import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";

const data = [
  { label: "None", value: "None" },
  { label: "High School", value: "High School" },
  { label: "Trade School", value: "Trade School" },
  {
    label: "College/University (4 Year)",
    value: "College/University (4 Year)",
  },
  { label: "other", value: "other" },
];

const EducationDropdown = ({
  initialValue,
  onEducationChange,
}: {
  initialValue: string;
  onEducationChange: (value: string) => void;
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
        placeholder="Education"
        searchPlaceholder="Search..."
        value={value}
        closeModalWhenSelectedItem={false}
        onChange={(item) => {
          onEducationChange(item.value);
          setValue(item.value);
        }}
        onChangeText={() => {}} // Keep search keyword
      />
    </View>
  );
};

export default EducationDropdown;

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
