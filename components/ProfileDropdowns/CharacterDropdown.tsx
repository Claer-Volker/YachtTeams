import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

const data = [
  { label: "Adventurous", value: "Adventurous" },
  { label: "Calm", value: "Calm" },
  { label: "Careless", value: "Careless" },
  { label: "Cheerful", value: "Cheerful" },
  { label: "Demanding", value: "Demanding" },
  { label: "Extroverted", value: "Extroverted" },
  { label: "Honest", value: "Honest" },
  { label: "Generous", value: "Generous" },
  { label: "Humorous", value: "Humorous" },
  { label: "Introverted", value: "Introverted" },
  { label: "Liberal", value: "Liberal" },
  { label: "Lively", value: "Lively" },
  { label: "Loner", value: "Loner" },
  { label: "Nervous", value: "Nervous" },
  { label: "Possessive", value: "Possessive" },
  { label: "Quiet", value: "Quiet" },
  { label: "Reserved", value: "Reserved" },
  { label: "Sensitive", value: "Sensitive" },
  { label: "Shy", value: "Shy" },
  { label: "Social", value: "Social" },
  { label: "Spontaneous", value: "Spontaneous" },
  { label: "Stubborn", value: "Stubborn" },
  { label: "Suspicious", value: "Suspicious" },
  { label: "Thoughtful", value: "Thoughtful" },
  { label: "Proud", value: "Proud" },
  { label: "Considerate", value: "Considerate" },
  { label: "Friendly", value: "Friendly" },
  { label: "Polite", value: "Polite" },
  { label: "Reliable", value: "Reliable" },
  { label: "Careful", value: "Careful" },
  { label: "Helpful", value: "Helpful" },
  { label: "Patient", value: "Patient" },
  { label: "Optimistic", value: "Optimistic" },
];

const CharacterDropdown = ({
  initialValue,
  onCharacterChange,
}: {
  initialValue: string;
  onCharacterChange: (value: string) => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef(null);

  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

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
    <View style={styles.container}>
      <MultiSelect
        inside
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
        placeholder="Character"
        searchPlaceholder="Search..."
        value={selected}
        onChange={(item) => {
          onCharacterChange(item);
          setSelected(item);
        }}
        selectedStyle={styles.selectedStyle}
        flatListProps={{ ListHeaderComponent: renderSelectAllIcon }}
      />
    </View>
  );
};

export default CharacterDropdown;

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    width: 300,
    backgroundColor: "transparent",
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
  selectedStyle: {
    borderRadius: 12,
  },
  wrapSelectAll: {
    alignItems: "flex-end",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  txtSelectAll: {
    color: "blue",
  },
});
