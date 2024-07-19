import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Button, Dimensions } from "react-native";
import Slider from "@react-native-community/slider";
import styles from "../assets/styles";
import BottomSheet, { useBottomSheet } from "@gorhom/bottom-sheet";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useAtom } from "jotai";
import { phoneLocationAtom } from "../atoms/currentLocationAtom";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { filteredUserListAtoms, userListAtoms } from "../atoms/userListAtoms";

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

// Function to calculate distance between two coordinates in meters using the Haversine formula
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in meters
  return distance;
}

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const [users, setUsers] = useAtom(userListAtoms);
  const [filteredUsers, setFilteredUsers] = useAtom(filteredUserListAtoms);
  const [latitude, setLatitude] = useState(0);
  const [latitudeDelta, setLatitudeDelta] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [longitudeDelta, setLongitudeDelta] = useState(0);
  const [location, setLocation] = useAtom(phoneLocationAtom);
  const [sliderValue, setSliderValue] = useState(50000);
  const maxValue = 2000000; // In meters
  const mapRef = useRef<MapView>(null);

  const handleSliderChange = (value: number) => {
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
      const { latitudeDelta, longitudeDelta } = getDeltaFromRadius(
        location.latitude,
        sliderValue
      );
      setLatitude(location.latitude);
      setLatitudeDelta(latitudeDelta);
      setLongitude(location.longitude);
      setLongitudeDelta(longitudeDelta);

      if (mapRef.current) {
        const degreeOffset = sliderValue / 111320;
        const coordinates = [
          {
            latitude: location.latitude + degreeOffset,
            longitude: location.longitude + degreeOffset,
          },
          {
            latitude: location.latitude - degreeOffset,
            longitude: location.longitude - degreeOffset,
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
  }, [location, sliderValue]);

  useEffect(() => {
    const filterUsersByDistance = () => {
      console.log("sliderValue", sliderValue);
      console.log("maxValue", maxValue);
      if (sliderValue == maxValue) {
        console.log("maxSlider", users);
        setFilteredUsers(users);
      } else {
        if (latitude && longitude && users.length > 0) {
          const filteredList = users.filter((user) => {
            const userLocation = user.location;
            const distance = haversineDistance(
              latitude,
              longitude,
              userLocation.latitude,
              userLocation.longitude
            );
            return distance <= sliderValue;
          });
          console.log("filteredList", filteredList);
          setFilteredUsers(filteredList);
        }
      }
    };

    filterUsersByDistance();
  }, [sliderValue, latitude, longitude, users]);

  const handlePlaceSelect = (data, details) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      setLatitude(lat);
      setLongitude(lng);
      setLocation({
        latitude: lat,
        longitude: lng,
      });
      const { latitudeDelta, longitudeDelta } = getDeltaFromRadius(
        lat,
        sliderValue
      );
      setLatitudeDelta(latitudeDelta);
      setLongitudeDelta(longitudeDelta);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta,
          longitudeDelta,
        });
      }
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
            fetchDetails={true}
            onPress={handlePlaceSelect}
            GooglePlacesDetailsQuery={{
              fields: "geometry",
            }}
            query={{
              key: "YOUR_GOOGLE_API_KEY",
              language: "en",
            }}
          />
        </View>

        <MapView
          ref={mapRef}
          center={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
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
