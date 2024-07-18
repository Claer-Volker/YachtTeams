import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Dropdown,
  IDropdownRef,
  MultiSelect,
} from "react-native-element-dropdown";

const data = [
  { label: "Long Term", value: "Long Term" },
  { label: "Seasonal", value: "Seasonal" },
  { label: "Free Lance", value: "Free Lance" },
  { label: "Delivery", value: "Delivery" },
  { label: "Shored Based", value: "Shored Based" },
];

export default function PreferredEmploymentType() {
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
        placeholder="Preferred Employment Type"
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
