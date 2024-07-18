import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";

const data = [
  { label: "none", value: "none" },
  { label: "Gray", value: "Gray" },
  { label: "Blue", value: "Blue" },
  { label: "Green", value: "Green" },
  { label: "Hazel", value: "Hazel" },
  { label: "Amber", value: "Amber" },
  { label: "Brown", value: "Brown" },
  { label: "Other", value: "Other" },
];

const EyeColorDropdown = ({
  initialValue,
  onEyeColorChange,
}: {
  initialValue: string;
  onEyeColorChange: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>();
  const ref = useRef<IDropdownRef>(null);

  useEffect(() => {
    console.log(initialValue);
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
        placeholder="Eye Color"
        searchPlaceholder="Search..."
        value={value}
        closeModalWhenSelectedItem={true}
        onChange={(item) => {
          onEyeColorChange(item.value);
          setValue(item.value);
        }}
      />
    </View>
  );
};

export default EyeColorDropdown;

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
