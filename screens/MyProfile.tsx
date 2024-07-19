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

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [picture, setPicture] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [userAge, setUserAge] = useState<string>();
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
    let userID = auth.currentUser?.uid;
    const q = query(collection(db, "Users"), where("userId", "==", userID));

    const querySnapshot = await getDocs(q);
    const usersList: any[] = []; // Initialize an empty array to accumulate users

    querySnapshot.forEach((doc) => {
      usersList.push(doc.data()); //
    });

    setUser(usersList[0].userId);
    setDate(usersList[0].userDOB.toDate());
    setPhoneNumber(usersList[0].phoneNumber);
    setPicture(usersList[0].Pictures);
    setGender(usersList[0].userGender);
    setUserName(usersList[0].UserName);
    setUserAge(usersList[0].age);
    setSexualPref(usersList[0].sexualOrientation);
    setRelationship(usersList[0].relationship);
    setChildren(usersList[0].children);
    setBodyType(usersList[0].bodyType);
    setPhoneNumber(usersList[0].phoneNumber);
    setJobTitle(usersList[0].jobTitle);

    setEyeColor(usersList[0].eyeColor);
    setHairColor(usersList[0].hairColor);
    setTattoos(usersList[0].tattoos);
    setPiercings(usersList[0].piercings);
    setCharacter(usersList[0].character);
    setEducation(usersList[0].education);
  }

  async function updateUser() {
    const userData = {
      UserName: userName ? userName : "",
      age: userAge ? userAge : "",
      userGender: gender ? gender : "",
      sexualOrientation: sexualPref ? sexualPref : "",
      relationship: relationship ? relationship : "",
      children: children ? children : "",
      bodyType: bodyType ? bodyType : "",
      eyeColor: eyeColor ? eyeColor : "",
      hairColor: hairColor ? hairColor : "",
      tattoos: tattoos ? tattoos : "",
      piercings: piercings ? piercings : "",
      character: character ? character : "",
      education: education ? education : "",
      userAge: userAge,
      userDOB: date,
    };

    const userDoc = doc(db, "Users", userID);

    try {
      await updateDoc(userDoc, userData);
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  }

  useEffect(() => {
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

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
      const profilePicture = await uploadImage(result.assets[0].uri);

      const userData = {
        Pictures: profilePicture,
      };
      const userDoc = doc(db, "Users", userID);

      try {
        await updateDoc(userDoc, userData);
        console.log("Picture updated successfully");
      } catch (error) {
        console.error("Error updating user: ", error);
      }
    }
  };

  const uploadImage = async (uri) => {
    // setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);

    const storageRef = ref(storage, `images/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL: string = await getDownloadURL(storageRef);
      return downloadURL;
      // Here you can set the download URL in your state or send it to your server
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Failed to upload image.");
      return null;
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
              <TextInput
                style={{
                  flex: 1,
                  height: 30,
                  fontSize: 16,
                  color: "#fff",
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                placeholder="Name"
                placeholderTextColor={"#fff"}
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

            {/* TODO: Return Values drop dropdown components back to MyProfile.tsx */}
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
                onPress={updateUser}
              >
                <Icon name="save" size={20} color={WHITE} />
                <Text style={styles.textButton}> Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionsProfile}>
            <TouchableOpacity style={styles.circledButton}>
              <Icon name="ellipsis-horizontal" size={20} color={WHITE} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.roundedButton}>
              <Icon name="chatbubble" size={20} color={WHITE} />
              <Text style={styles.textButton}>Start chatting</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default MyProfile;
