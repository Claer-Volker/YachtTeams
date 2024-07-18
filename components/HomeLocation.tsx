import { View, StyleSheet, Text, Button, Dimensions } from "react-native";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { useBottomSheet } from "@gorhom/bottom-sheet";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useAtom } from "jotai";
import { phoneLocationAtom } from "../atoms/currentLocationAtom";
import Slider from "@react-native-community/slider";
import styles from "../assets/styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
export type Ref = BottomSheet;

interface Props {
  title: string;
}

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CloseBtn = () => {
  const { close } = useBottomSheet();

  return <Button title="Close" onPress={() => close()} />;
};

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const [latitude, setLatitude] = useState(0);
  const [latitudeDelta, setLatitudeDelta] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [longitudeDelta, setLongitudeDelta] = useState(0);
  const [location, setLocation] = useAtom(phoneLocationAtom);
  const [sliderValue, setSliderValue] = useState(50000);
  const maxValue = 2000000; // In meters
  const mapRef = useRef<MapView>(null);

  const handleSliderChange = (value: number) => {
    // Round value to nearest 1000
    const roundedValue = Math.round(value / 100) * 100;
    setSliderValue(roundedValue);
  };

  const getDeltaFromRadius = (latitude: number, radius: number) => {
    const oneDegreeOfLatitudeInMeters = 111000; // meters
    const latitudeDelta = radius / oneDegreeOfLatitudeInMeters;
    const longitudeDelta =
      radius /
      (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)));

    return {
      latitudeDelta,
      longitudeDelta: longitudeDelta * ASPECT_RATIO,
    };
  };

  useEffect(() => {
    if (location) {
      if (sliderValue == maxValue) {
        const { latitudeDeltaMax, longitudeDeltaMax } = {
          latitudeDeltaMax: 0,
          longitudeDeltaMax: 0,
        };
        setLatitude(location?.latitude);
        setLatitudeDelta(latitudeDeltaMax);
        setLongitude(location?.longitude);
        setLongitudeDelta(longitudeDeltaMax);
      } else {
        const { latitudeDelta, longitudeDelta } = getDeltaFromRadius(
          latitude,
          sliderValue
        );
        setLatitude(location.latitude);
        setLatitudeDelta(latitudeDelta);
        setLongitude(location.longitude);
        setLongitudeDelta(longitudeDelta);

        if (mapRef.current) {
          const degreeOffset = sliderValue / 111320; // Approximate conversion of meters to degrees
          const coordinates = [
            {
              latitude: latitude + degreeOffset,
              longitude: longitude + degreeOffset,
            },
            {
              latitude: latitude - degreeOffset,
              longitude: longitude - degreeOffset,
            },
          ];

          if (mapRef.current) {
            mapRef.current.fitToCoordinates(coordinates, {
              edgePadding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              },
              animated: true,
            });
          }
        }
      }
    }
  }, [location]);

  useEffect(() => {
    if (sliderValue !== maxValue) {
      if (latitude !== 0 && longitude !== 0) {
        const degreeOffset = sliderValue / 111320; // Approximate conversion of meters to degrees
        const coordinates = [
          {
            latitude: latitude + degreeOffset,
            longitude: longitude + degreeOffset,
          },
          {
            latitude: latitude - degreeOffset,
            longitude: longitude - degreeOffset,
          },
        ];

        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: {
              top: 80,
              right: 40,
              bottom: 40,
              left: 40,
            },
            animated: true,
          });
        }
      }
    } else {
      if (mapRef.current) {
        const globalRegion = {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 180,
          longitudeDelta: 360,
        };

        mapRef.current.animateToRegion(globalRegion, 1000);
      }
    }
  }, [sliderValue, latitude, longitude]);

  const handlePlaceSelect = (data, details) => {
    if (details) {
      const { lat, lng } = details.geometry.location; // Extract latitude and longitude

      setLatitude(lat); // Update latitude
      setLongitude(lng);
      setLocation({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      });
      const degreeOffset = sliderValue / 111320;
      const coordinates = [
        {
          latitude: latitude + degreeOffset,
          longitude: longitude + degreeOffset,
        },
        {
          latitude: latitude - degreeOffset,
          longitude: longitude - degreeOffset,
        },
      ];

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      // if (mapRef.current) {
      //   mapRef.current.fitToCoordinates(coordinates, {
      //     edgePadding: {
      //       top: 80,
      //       right: 40,
      //       bottom: 40,
      //       left: 40,
      //     },
      //     animated: true,
      //   });
      // } // Update longitude

      // // Optionally animate to the selected place
      // if (mapRef.current) {
      //   mapRef.current.animateToRegion({
      //     latitude: lat,
      //     longitude: lng,
      //     latitudeDelta: 0.05,
      //     longitudeDelta: 0.05,
      //   });
      // }
    }
  };

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
            position: "absolute",
            top: -10,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: 10,
            width: "100%",
          }}
        >
          <View style={styles.mapSliderContainer}>
            <Text style={styles.mapSliderLabel}>Search Radius</Text>
            <Slider
              value={sliderValue}
              step={10000}
              onValueChange={handleSliderChange}
              style={{ width: 200, height: 40 }}
              minimumValue={50000}
              maximumValue={2000000}
              minimumTrackTintColor="#444444"
              maximumTrackTintColor="#000000"
            />
            <Text style={styles.mapSliderLabel}>
              {sliderValue === maxValue
                ? "World Wide"
                : sliderValue / 1000 + "Km"}
            </Text>
          </View>

          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={3}
            enablePoweredByContainer={false}
            styles={{
              textInputContainer: {
                backgroundColor: "white",
                borderTopWidth: 0,
                padding: 10,
                borderBottomWidth: 0,
                shadowColor: "#222",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 10,
              },
              textInput: {
                height: 38,
                color: "#5d5d5d",
                fontSize: 16,
              },
              predefinedPlacesDescription: {
                color: "#1faadb",
              },
            }}
            // onPress={(data, details = null) => {
            //   if (data) {

            //     // const { lat, lng } = details.geometry.location;
            //     // setLatitude(lat);
            //     // setLongitude(lng);
            //   }
            // }}
            // onPress={async (data, details = null) => {
            //   let latitude = details.geometry.location.lat;
            //   let longitude = details.geometry.location.lng;
            //   let coordObj = { latitude, longitude };
            //   const address = await Location.reverseGeocodeAsync(coordObj);
            //   let city = address[0].city;
            //   setLocation(data.description);
            //   setCity(city);
            // }}
            fetchDetails={true}
            onPress={handlePlaceSelect}
            GooglePlacesDetailsQuery={{
              fields: "geometry",
            }}
            query={{
              key: "AIzaSyCA1P52HiFWFh-Qyt7V45eUDTdmkGx43ic",
              language: "en",
            }}
          />
        </View>

        <MapView
          ref={mapRef}
          center={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LONGITUDE_DELTA,
            longitudeDelta: LATITUDE_DELTA,
          }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LONGITUDE_DELTA,
            longitudeDelta: LATITUDE_DELTA,
          }}
          customMapStyle={{
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off",
              },
            ],
          }}
          style={{
            width: "100%",
            height: "90%",
          }}
        >
          <Marker
            draggable
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            onDragEnd={(e) => console.log({ x: e.nativeEvent.coordinate })}
          />
          {sliderValue !== maxValue && (
            <Circle
              center={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LONGITUDE_DELTA,
                longitudeDelta: LATITUDE_DELTA,
              }}
              radius={sliderValue}
              strokeWidth={3}
              strokeColor={"#1cb8c4"}
              fillColor={"rgba(230,238,255,0.1)"}
            />
          )}
        </MapView>

        <CloseBtn />
      </View>
    </BottomSheet>
  );
});

export default CustomBottomSheet;
