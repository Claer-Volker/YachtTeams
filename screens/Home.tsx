import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ImageBackground,
  Image,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { City, Filters, Icon } from "../components";
import styles, {
  DARK_GRAY,
  DISLIKE_ACTIONS,
  LIKE_ACTIONS,
  STAR_ACTIONS,
} from "../assets/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../components/HomeLocation";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import * as Location from "expo-location";
import { auth, db } from "../firebaseConfig";
import { useAtom } from "jotai";
import { phoneLocationAtom } from "../atoms/currentLocationAtom";
import FilterBottomSheet from "../components/FilterSheet";
import { FlatList } from "react-native-gesture-handler";
import { filteredUserListAtoms, userListAtoms } from "../atoms/userListAtoms";

const Home = () => {
  const bottomSheetRef = useRef<BottomSheet>();
  const filterSheetRef = useState<BottomSheet>();

  const [users, setUsers] = useAtom(userListAtoms);
  const [filteredUsers, setFilteredUsers] = useAtom(filteredUserListAtoms);
  const [location, setLocation] = useAtom(phoneLocationAtom);

  const [city, setCity] = useState("Loading...");
  const [refreshing, setRefreshing] = useState(true);

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});

    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "Users", user.uid); // Assuming userID is the document ID
      await updateDoc(userRef, {
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      });
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
    console.log("location", location);
  }, [auth.currentUser]);

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  async function getUsers() {
    const usersRef = collection(db, "Users");
    const userID = auth.currentUser?.uid;
    fetchUsersNotIgnoring(usersRef, userID)
      .then((filteredDocs) => {
        const usersList: any[] = [];

        filteredDocs.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          const data = doc.data() as { userId: string }; // Type assertion

          if (data.userId !== userID) {
            usersList.push(data);
          }
        });
        setRefreshing(false);
        console.log(users);
        setUsers(usersList);
        // setFilteredUsers(usersList);
      })
      .catch((error) => {
        console.error("Error in fetchUsersNotIgnoring:", error);
      });
  }

  const likeProfile = async (likedUid: string) => {
    const likerUid = auth.currentUser?.uid;
    if (likedUid) {
      try {
        await addDoc(collection(db, "Likes"), {
          liker: likerUid,
          liked: likedUid,
          timestamp: serverTimestamp(),
        });
        await checkForMutualLikeAndCreateMatch(likerUid, likedUid);
        console.log(`User ${likerUid} liked ${likedUid}`);
      } catch (error) {
        console.error("Error liking profile:", error);
      }
    }
  };

  const checkForMutualLikeAndCreateMatch = async (
    likerUid: string,
    likedUid: string
  ) => {
    try {
      const q = query(
        collection(db, "Likes"),
        where("liker", "==", likedUid),
        where("liked", "==", likerUid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Mutual like exists, create a match
        await addDoc(collection(db, "Matches"), {
          user1: likerUid,
          user2: likedUid,
          timestamp: serverTimestamp(),
          status: "matched",
        });
        console.log(`Match created between ${likerUid} and ${likedUid}`);
      } else {
        console.log(`No mutual like found between ${likerUid} and ${likedUid}`);
      }
    } catch (error) {
      console.error("Error checking for mutual like or creating match:", error);
    }
  };

  async function fetchUsersNotIgnoring(usersRef, userID) {
    try {
      // Fetch all documents from the users collection
      const querySnapshot = await getDocs(usersRef);

      if (!querySnapshot.empty) {
        // Filter documents that do not contain the userID in the ignored array
        const filteredDocs = querySnapshot.docs.filter((doc) => {
          const data = doc.data();
          // Check if 'ignored' field exists and is an array
          return (
            !data.ignored ||
            !Array.isArray(data.ignored) ||
            !data.ignored.includes(userID)
          );
        });

        // Log the filtered documents
        filteredDocs.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });

        return filteredDocs;
      } else {
        console.warn("No documents found in the collection");
        return [];
      }
    } catch (error) {
      console.error("Error fetching or filtering documents:", error);
      throw error; // Rethrow the error if needed for further handling
    }
  }

  async function getCity() {
    const { latitude, longitude } = location;

    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocode.length > 0) {
      setCity(reverseGeocode[0]?.city);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getCity();
  }, [location]);

  console.disableYellowBox = true;

  // function showAuth() {
  //   getAuth().onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const uid = user.uid;
  //     } else {
  //       console.log("User is signed out");
  //     }
  //   });
  // }

  // Function to ignore a profile
  const ignoreProfile = async (profileUid: string) => {
    try {
      const currentUserUid = auth.currentUser?.uid;
      if (!currentUserUid) {
        console.log("User is not signed in");
        return;
      }
      const userRef = doc(db, "Users", profileUid); // Assuming userID is the document ID
      await updateDoc(userRef, {
        ignored: arrayUnion(currentUserUid),
      });
      getUsers();
      console.log(`User ${profileUid} ignored by ${currentUserUid}`);
    } catch (error) {
      console.error("Error ignoring profile:", error);
      // Handle errors as needed
    }
  };

  async function addToFavorites(profileUid: string) {
    try {
      const currentUserUid = auth.currentUser?.uid;
      if (!currentUserUid) {
        console.log("User is not signed in");
        return;
      }
      const userRef = doc(db, "Users", profileUid);
      await updateDoc(userRef, {
        favoritedBy: arrayUnion(currentUserUid),
      });
      console.log(`User ${profileUid} added to favorites by ${currentUserUid}`);
    } catch (error) {
      console.error("Error ignoring profile:", error);
      // Handle errors as needed
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, height: "100%", width: "100%" }}>
      <ImageBackground
        source={require("../assets/images/bg.png")}
        style={styles.bg}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "#fff",
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >
          <Image
            source={require("../assets/YTIcon.png")}
            style={{ width: 80, height: 30 }}
          />
          <Image
            source={require("../assets/YTIconText.png")}
            style={{ width: 80, height: 30 }}
          />
        </View>
        <View style={styles.containerHome}>
          <View style={styles.top}>
            <City bottomSheetRef={bottomSheetRef} title={city} />
            <Filters filterSheetRef={filterSheetRef} />
          </View>

          {users?.length > 0 && (
            //  {refreshing ? <ActivityIndicator /> : null}
            <FlatList
              data={filteredUsers}
              // onRefresh={() => getUsers()}
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,

                    width: "100%",
                    height: 180,
                    backgroundColor: "#eee",
                    marginTop: 5,
                    marginBottom: 5,
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    shadowColor: "#222",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                >
                  <Image
                    source={{ uri: item?.Pictures }}
                    style={{
                      borderRadius: 8,
                      width: "50%",
                      height: "100%",
                    }}
                  />
                  <View style={{ flex: 1, padding: 10 }}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "600",
                        color: DARK_GRAY,
                      }}
                    >
                      {item.UserName}, {item.age}
                    </Text>
                    <View style={styles.actionsCardItem}>
                      <TouchableOpacity
                        style={styles.miniButton}
                        onPress={() => ignoreProfile(item.userId)}
                      >
                        <Icon name="close" color={DISLIKE_ACTIONS} size={14} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.miniButton}
                        onPress={() => likeProfile(item.userId)}
                      >
                        <Icon name="heart" color={LIKE_ACTIONS} size={14} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.miniButton}
                        onPress={() => addToFavorites(item.userId)}
                      >
                        <Icon name="star" color={STAR_ACTIONS} size={14} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              enableEmptySections={true}
              keyExtractor={(item) => item.UserName}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={getUsers} />
              }
            />
            // <CardStack
            //   loop
            //   verticalSwipe={false}
            //   renderNoMoreCards={() => null}
            //   ref={(newSwiper): void => setSwiper(newSwiper)}
            // >
            //   {users.map((item, index) => (
            //     <Card key={index}>
            //       <CardItem
            //         hasActions
            //         image={item.Pictures}
            //         name={item.UserName}
            //         location={item.location}
            //         description={
            //           "Adventure Seeker | Food Lover | Eternal Optimist"
            //         }
            //       />
            //     </Card>
            //   ))}
            // </CardStack>
          )}
        </View>
      </ImageBackground>

      <CustomBottomSheet ref={bottomSheetRef} title="hi" />
      <FilterBottomSheet ref={filterSheetRef} />
    </SafeAreaView>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default Home;
