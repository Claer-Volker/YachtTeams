import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

const data = [
  { label: "none", value: "none" },
  { label: "discreet", value: "discreet" },
  { label: "Not Visible", value: "Not Visible" },
  { label: "Visible", value: "Visible" },
];

const PiercingsDropdown = ({
  initialValue,
  onPiercingsChange,
}: {
  initialValue: string;
  onPiercingsChange: (value: string) => void;
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
    if (selected) {
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
    } else {
      return (
        <TouchableOpacity
          style={styles.wrapSelectAll}
          onPress={() => onSelectAll(true)}
        >
          <Text style={styles.txtSelectAll}>{`Select All`}</Text>
        </TouchableOpacity>
      );
    }
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
        placeholder="Piercings"
        searchPlaceholder="Search..."
        value={selected}
        onChange={(item) => {
          onPiercingsChange(item);
          setSelected(item);
        }}
        selectedStyle={styles.selectedStyle}
        flatListProps={{ ListHeaderComponent: renderSelectAllIcon }}
      />
    </View>
  );
};

export default PiercingsDropdown;

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
