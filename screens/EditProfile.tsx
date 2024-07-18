import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Icon } from "../components";
import DEMO from "../assets/data/demo";
import styles, { BLACK, DARK_GRAY, GRAY, WHITE } from "../assets/styles";
import { auth, db, storage } from "../firebaseConfig";
import { useAtom } from "jotai";
import { userIDAtom } from "../atoms/userAtom";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import CharacterDropdown from "../components/ProfileDropdowns/CharacterDropdown";
import PiercingsDropdown from "../components/ProfileDropdowns/PiercingsDropdown";
import TattoosDropdown from "../components/ProfileDropdowns/TattoosDropdown";
import GenderDropdown from "../components/ProfileDropdowns/GenderDropdown";
import EducationDropdown from "../components/ProfileDropdowns/EducationDropdown";
import RelationshipDropdown from "../components/ProfileDropdowns/RelationshipDropdown";
import ChildrenDropdown from "../components/ProfileDropdowns/ChildrenDropdown";
import HairDropdown from "../components/ProfileDropdowns/HairDropdown";
import BodyTypeDropdown from "../components/ProfileDropdowns/BodyTypeDropdown";
import EyeColorDropdown from "../components/ProfileDropdowns/EyeColorDropdown";
import SexualPrefDropdown from "../components/ProfileDropdowns/SexualPrefDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NavigationProp } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useNavigation } from "@react-navigation/native";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userID, setUserID] = useAtom(userIDAtom);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [picture, setPicture] = useState<string>();
  const [uploadedImage, setUploadedImage] = useState("");
  const [userName, setUserName] = useState<string>();
  const [userAge, setUserAge] = useState<number>();
  const [gender, setGender] = useState<string>();
  const [sexualPref, setSexualPref] = useState<string>();
  const [relationship, setRelationship] = useState<string>();
  const [children, setChildren] = useState<string>();
  const [bodyType, setBodyType] = useState<string>();
  const [eyeColor, setEyeColor] = useState<string>();
  const [hairColor, setHairColor] = useState<string>();
  const [tattoos, setTattoos] = useState<string>([]);
  const [piercings, setPiercings] = useState<string>([]);
  const [character, setCharacter] = useState<string>([]);
  const [education, setEducation] = useState<string>();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  // Dropdown Changes
  const handleGenderChange = (selectedGender: string) => {
    setGender(selectedGender);
  };
  const handleSexualPrefChange = (selectedSexualPref: string) => {
    setSexualPref(selectedSexualPref);
  };

  const handleRelationshipChange = (selectedRelationship: string) => {
    setRelationship(selectedRelationship);
  };

  const handleChildrenChange = (selectedChildren: string) => {
    setChildren(selectedChildren);
  };

  const handleBodyTypeChange = (selectedBodyType: string) => {
    setBodyType(selectedBodyType);
  };

  const handleEyeColorChange = (selectedEyeColor: string) => {
    setEyeColor(selectedEyeColor);
  };

  const handleHairColorChange = (selectedHairColor: string) => {
    setHairColor(selectedHairColor);
  };

  const handleTattoosChange = (selectedTattoos: string) => {
    setTattoos(selectedTattoos);
  };

  const handlePiercingsChange = (selectedPiercings: string) => {
    setPiercings(selectedPiercings);
  };

  const handleCharacterChange = (selectedCharacter: string) => {
    setCharacter(selectedCharacter);
  };

  const handleEducationChange = (selectedEducation: string) => {
    setEducation(selectedEducation);
  };
  // Dropdown Changes

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {});

    return () => unsubscribe();
  }, []);

  async function getUsers() {
    const q = query(collection(db, "Users"), where("userId", "==", userID));

    const querySnapshot = await getDocs(q);
    const usersList: any[] = [];

    querySnapshot.forEach((doc) => {
      usersList.push(doc.data());
    });
  }

  function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    console.log("birthDate", birthDate);
    console.log("today", today);
    console.log("today", age);
    // Create a date object for the birthday this year
    const currentYearBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    // If today's date is before the birthday this year, subtract 1 from the age
    if (today < currentYearBirthday) {
      age--;
    }

    console.log("age", age);
    setUserAge(age);
  }

  useEffect(() => {
    calculateAge(date);
  }, [date]);

  const uploadImage = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);

    const storageRef = ref(storage, `images/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL: string = await getDownloadURL(storageRef);
      setUploadedImage(downloadURL);
      console.log("Download URL: ", downloadURL);
      return downloadURL;
      // Here you can set the download URL in your state or send it to your server
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Failed to upload image.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  async function createUser() {
    const profilePicture = await uploadImage(picture);
    console.log("profilePicture", profilePicture);
    const userData = {
      UserName: userName ? userName : "",
      userId: userID,
      age: userAge,
      userGender: gender ? gender : "",
      sexualOrientation: sexualPref ? sexualPref : "",
      relationship: relationship ? relationship : "",
      jobTitle: jobTitle ? jobTitle : "",
      phoneNumber: phoneNumber ? phoneNumber : "",
      children: children ? children : "",
      bodyType: bodyType ? bodyType : "",
      eyeColor: eyeColor ? eyeColor : "",
      hairColor: hairColor ? hairColor : "",
      tattoos: tattoos ? tattoos : "",
      piercings: piercings ? piercings : "",
      character: character ? character : "",
      education: education ? education : "",
      Pictures: profilePicture,
      userAge: userAge,
      userDOB: date,
    };

    const userDoc = doc(db, "Users", userID);

    try {
      await setDoc(userDoc, userData);
      setUserID(userID);
      console.log("User updated successfully");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  }

  useEffect(() => {
    getUsers();
  }, [userID]);

  useEffect(() => {
    const authID = auth.currentUser?.uid;
    console.log("authID", authID);
    if (authID) {
      setUserID(authID);
    }
    getUsers();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.bg}>
      <ImageBackground
        source={require("../assets/images/bg.png")}
        style={styles.bg}
      >
        <ScrollView style={styles.containerProfile}>
          <ImageBackground source={{ uri: picture }} style={styles.photo}>
            <View style={styles.top}>
              <TouchableOpacity></TouchableOpacity>

              <TouchableOpacity onPress={pickImage}>
                <Icon
                  name="camera"
                  size={20}
                  color={DARK_GRAY}
                  style={styles.topIconRight}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <View style={styles.containerProfileItem}>
            <View style={styles.matchesProfileItem}>
              <Text style={styles.matchesTextProfileItem}>Profile</Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 50,
                  fontSize: 16,
                  color: "#222",
                  width: 280,

                  borderBottomColor: "gray",
                  borderBottomWidth: 0.5,
                }}
                placeholder="Name"
                placeholderTextColor={"#222"}
                selectionColor={"#222"}
                autoCorrect={false}
                value={userName}
                onChangeText={(text) => setUserName(text)}
              />
            </View>

            <TouchableOpacity
              onPress={(e) => setShow(true)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                // backgroundColor: "#1cb8c4",
                padding: 16,
              }}
            >
              {/* <Text>selected: {date.toLocaleString()}</Text> */}
              <Text style={{ fontSize: 16 }}>Birthday:</Text>
              <DateTimePicker
                value={date}
                mode={"date"}
                style={{
                  backgroundColor: "#1cb8c4",
                }}
                is24Hour={true}
                onChange={(event, selectedDate) => setDate(selectedDate)}
              />
            </TouchableOpacity>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 50,
                  fontSize: 16,
                  color: "#222",
                  width: 280,

                  borderBottomColor: "gray",
                  borderBottomWidth: 0.5,
                }}
                placeholder="Phone Number"
                placeholderTextColor={"#222"}
                selectionColor={"#222"}
                autoCorrect={false}
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
              />
            </View>

            <GenderDropdown
              initialValue={gender?.toString()}
              onGenderChange={handleGenderChange}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 50,
                  fontSize: 16,
                  color: "#222",
                  width: 280,

                  borderBottomColor: "gray",
                  borderBottomWidth: 0.5,
                }}
                placeholder="Job Title"
                placeholderTextColor={"#222"}
                selectionColor={"#222"}
                autoCorrect={false}
                value={jobTitle}
                onChangeText={(text) => setJobTitle(text)}
              />
            </View>

            {/* TODO: Return Values drop dropdown components back to EditProfile.tsx */}
            <EducationDropdown
              initialValue={education?.toString()}
              onEducationChange={handleEducationChange}
            />
            <SexualPrefDropdown
              initialValue={sexualPref?.toString()}
              onSexualPrefChange={handleSexualPrefChange}
            />
            {/* {user?.sexualOrientation.orientation} */}
            <RelationshipDropdown
              initialValue={relationship?.toString()}
              onRelationshipChange={handleRelationshipChange}
            />
            <ChildrenDropdown
              initialValue={children?.toString()}
              onChildrenChange={handleChildrenChange}
            />
            <BodyTypeDropdown
              initialValue={bodyType?.toString()}
              onBodyTypeChange={handleBodyTypeChange}
            />
            <EyeColorDropdown
              initialValue={eyeColor?.toString()}
              onEyeColorChange={handleEyeColorChange}
            />
            {/* <BodyTypeDropdown /> */}
            <HairDropdown
              initialValue={hairColor?.toString()}
              onHairColorChange={handleHairColorChange}
            />
            <TattoosDropdown
              initialValue={tattoos}
              onTattoosChange={handleTattoosChange}
            />
            <PiercingsDropdown
              initialValue={piercings}
              onPiercingsChange={handlePiercingsChange}
            />
            <CharacterDropdown
              initialValue={character}
              onCharacterChange={handleCharacterChange}
            />
            <View style={{ marginTop: 16, paddingHorizontal: 50 }}>
              <TouchableOpacity
                style={styles.roundedButton}
                onPress={createUser}
              >
                <Icon name="save" size={20} color={WHITE} />
                <Text style={styles.textButton}> Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default EditProfile;
