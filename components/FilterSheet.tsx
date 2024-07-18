import {
  View,
  StyleSheet,
  Text,
  Button,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  RefObject,
  SetStateAction,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet, { useBottomSheet } from "@gorhom/bottom-sheet";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useAtom } from "jotai";
import { phoneLocationAtom } from "../atoms/currentLocationAtom";
import Slider from "@react-native-community/slider";
import styles from "../assets/styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import LegalToWorkIn from "./FilterDropdowns/LegalToWorkIn";
import PreferredTeamType from "./FilterDropdowns/PreferedTeamType";
import GenderDropdown from "./FilterDropdowns/Gender";
import Nationality from "./FilterDropdowns/Nationality";
import Languages from "./FilterDropdowns/LanguagesSpoken";
import Icon from "./Icon";
import CurrentPosition from "./FilterDropdowns/CurrentPosition";
import PreferredEmploymentType from "./FilterDropdowns/PreferredEmploymentType";
import PreferredVesselType from "./FilterDropdowns/PreferredVesselType";
export type Ref = BottomSheet;

interface Props {
  filterSheetRef: RefObject<BottomSheet>;
}

const CloseBtn = () => {
  const { close } = useBottomSheet();

  return <Button title="Close" onPress={() => close()} />;
};

const AnimatedView = Animated.createAnimatedComponent(View);

function LabelBase(props) {
  const { position, value, leftDiff, pressed } = props;
  const scaleValue = React.useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
  const cachedPressed = React.useRef(pressed);

  React.useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1 : 0.1,
      duration: 200,
      delay: pressed ? 0 : 2000,
      useNativeDriver: false,
    }).start();
    cachedPressed.current = pressed;
  }, [pressed]);

  return (
    Number.isFinite(position) &&
    Number.isFinite(value) && (
      <AnimatedView
        style={[
          styles.sliderLabel,
          {
            left: position - 50 / 2,
            transform: [
              { translateY: 50 },
              { scale: scaleValue.current },
              { translateY: -50 },
            ],
          },
        ]}
      >
        <View
          style={{
            position: "absolute",
            bottom: -(50 * 0.47) / 4,
            left: (50 - 50 * 0.47) / 2,
            transform: [{ rotate: "45deg" }],
            width: 50 * 0.47,
            height: 50 * 0.47,
            backgroundColor: "#999",
          }}
        />
        <Text style={styles.sliderLabelText}>{value}</Text>
      </AnimatedView>
    )
  );
}

export function CustomLabel(props) {
  const {
    leftDiff,
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
  } = props;

  return (
    <View>
      <LabelBase
        position={oneMarkerLeftPosition}
        value={oneMarkerValue}
        leftDiff={leftDiff}
        pressed={oneMarkerPressed}
      />
      <LabelBase
        position={twoMarkerLeftPosition}
        value={twoMarkerValue}
        leftDiff={leftDiff}
        pressed={twoMarkerPressed}
      />
    </View>
  );
}

const FilterBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const [sliderOneChanging, setSliderOneChanging] = useState(false);
  const [sliderOneValue, setSliderOneValue] = useState([5]);
  const [multiSliderValue, setMultiSliderValue] = useState([20, 50]);
  const [nonCollidingMultiSliderValue, setNonCollidingMultiSliderValue] =
    useState([0, 100]);
  const [moreFilters, setMoreFilters] = useState(false);

  const sliderOneValuesChangeStart = () => setSliderOneChanging(true);

  const sliderOneValuesChange = (values: number[]) => setSliderOneValue(values);

  const sliderOneValuesChangeFinish = () => setSliderOneChanging(false);

  const multiSliderValuesChange = (values: SetStateAction<number[]>) =>
    setMultiSliderValue(values);

  const nonCollidingMultiSliderValuesChange = (values: number[]) =>
    setNonCollidingMultiSliderValue(values);

  return (
    <BottomSheet
      ref={ref}
      enablePanDownToClose={true}
      index={-1}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#fff" }}
      backgroundStyle={{ backgroundColor: "#fff" }}
    >
      <View style={styles.mapContentContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Filters
          </Text>
          {/* <Text>Preferred Team Type</Text> */}
          <PreferredTeamType />
          <GenderDropdown />
          <View style={{ marginHorizontal: 10 }}>
            <View style={styles.ageSlider}>
              <Text style={{ alignSelf: "center", paddingVertical: 0 }}>
                {multiSliderValue[0]}
              </Text>
              <Text>Age</Text>
              <Text style={{ alignSelf: "center", paddingVertical: 0 }}>
                {multiSliderValue[1]}
              </Text>
            </View>

            <MultiSlider
              values={[multiSliderValue[0], multiSliderValue[1]]}
              sliderLength={300}
              onValuesChange={multiSliderValuesChange}
              min={18}
              max={90}
              step={1}
              allowOverlap
              snapped
              customLabel={CustomLabel}
            />
          </View>
          <LegalToWorkIn />
          <Nationality />
          <Languages />
        </View>
        {moreFilters && (
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 3,
              display: "flex",
              flex: 1,
            }}
          >
            <CurrentPosition />
            <PreferredEmploymentType />
            <PreferredVesselType />
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* <Button
            title="More Filters"
            onPress={() => console.log("more")}
            color="#444"
            titleStyle={{
              color: "white",
              fontSize: 10,
            }}
            buttonStyle={{
              backgroundColor: "white",
              borderRadius: 60,
              flex: 1,
              height: 30,
              width: 30,
            }}
          
          /> */}
          <TouchableWithoutFeedback
            onPress={() => setMoreFilters(!moreFilters)}
            style={{ flex: 1, backgroundColor: "black" }}
          >
            {moreFilters ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 10,
                }}
              >
                <Text style={{ fontSize: 12, color: "#444", marginRight: 4 }}>
                  More Filters
                </Text>
                <Icon name="chevron-up-outline" size={12} color="#444" />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 10,
                }}
              >
                <Text style={{ fontSize: 12, color: "#444", marginRight: 4 }}>
                  More Filters
                </Text>
                <Icon name="chevron-down-outline" size={12} color="#444" />
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>

        <CloseBtn />
      </View>
    </BottomSheet>
  );
});

export default FilterBottomSheet;
