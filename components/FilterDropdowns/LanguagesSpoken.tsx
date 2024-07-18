import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

const initialData = [
  { label: "French", value: "French" },
  { label: "Spanish", value: "Spanish" },
  { label: "English", value: "English" },
  { label: "Russian", value: "Russian" },
  { label: "Other", value: "Other" },
];

const data = [
  { label: "French", value: "French" },
  { label: "Spanish", value: "Spanish" },
  { label: "English", value: "English" },
  { label: "Russian", value: "Russian" },
  { label: "Arabic", value: "Arabic" },
  { label: "Afrikaans", value: "Afrikaans" },
  { label: "Awadhi", value: "Awadhi" },
  { label: "Azerbaijani, South", value: "Azerbaijani, South" },
  { label: "Bengali", value: "Bengali" },
  { label: "Bhojpuri", value: "Bhojpuri" },
  { label: "Burmese", value: "Burmese" },
  { label: "Chinese, Cantonese", value: "Chinese, Cantonese" },
  { label: "Chinese, Gan", value: "Chinese, Gan" },
  { label: "Chinese, Hakka", value: "Chinese, Hakka" },
  { label: "Chinese, Jinyu", value: "Chinese, Jinyu" },
  { label: "Chinese, Mandarin", value: "Chinese, Mandarin" },
  { label: "Chinese, Min Nan", value: "Chinese, Min Nan" },
  { label: "Chinese, Wu", value: "Chinese, Wu" },
  { label: "Chinese, Xiang", value: "Chinese, Xiang" },
  { label: "Dutch", value: "Dutch" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Hausa", value: "Hausa" },
  { label: "Hindi", value: "Hindi" },
  { label: "Italian", value: "Italian" },
  { label: "Japanese", value: "Japanese" },
  { label: "Javanese", value: "Javanese" },
  { label: "Kannada", value: "Kannada" },
  { label: "Korean", value: "Korean" },
  { label: "Maithili", value: "Maithili" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Marathi", value: "Marathi" },
  { label: "Oriya", value: "Oriya" },
  { label: "Panjabi", value: "Panjabi" },
  { label: "Persian", value: "Persian" },
  { label: "Polish", value: "Polish" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Romanian", value: "Romanian" },
  { label: "Russian", value: "Russian" },
  { label: "Serbo-Croatian4", value: "Serbo-Croatian4" },
  { label: "Sindhi", value: "Sindhi" },
  { label: "Sunda", value: "Sunda" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Thai", value: "Thai" },
  { label: "Turkish", value: "Turkish" },
  { label: "Ukrainian", value: "Ukrainian" },
  { label: "Urdu", value: "Urdu" },
  { label: "Vietnamese", value: "Vietnamese" },
  { label: "Yoruba", value: "Yoruba" },
  { label: "Other", value: "Other" },
];

const Languages = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [dropdownData, setDropdownData] = useState(initialData);
  const ref = useRef(null);

  const onSelectAll = (isSelectAll = true) => {
    const selectItem: string[] = [];
    if (isSelectAll) {
      data.map((item) => {
        selectItem.push(item.value);
      });
    }
    setSelected(selectItem);
  };

  useEffect(() => {
    if (selected.toString().includes("Other")) {
      setDropdownData(data);
    } else {
      setDropdownData(initialData);
    }
  }, [selected]);

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
        data={dropdownData}
        labelField="label"
        valueField="value"
        placeholder="Languages Spoken"
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
};

export default Languages;

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
