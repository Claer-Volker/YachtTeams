import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const fetchMatchesWithLastMessages = async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.log("User is not signed in");
    return [];
  }

  const currentUserUid = currentUser.uid;

  try {
    const q1 = query(
      collection(db, "Matches"),
      where("user1", "==", currentUserUid)
    );
    const q2 = query(
      collection(db, "Matches"),
      where("user2", "==", currentUserUid)
    );

    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);

    const matches = [
      ...querySnapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...querySnapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ];

    if (matches.length === 0) {
      return [];
    }

    const matchedUserIds = matches.map((match) =>
      match.user1 === currentUserUid ? match.user2 : match.user1
    );

    if (matchedUserIds.includes(undefined)) {
      console.error("One of the matched user IDs is undefined");
      return [];
    }

    const profiles = await fetchUserProfiles(matchedUserIds);

    const matchWithLastMessages = await Promise.all(
      profiles.map(async (profile) => {
        const match = matches.find(
          (match) => match.user1 === profile.id || match.user2 === profile.id
        );
        const matchId = match.id;

        const lastMessageQuery = query(
          collection(db, "Messages"),
          where("matchId", "==", matchId),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const lastMessageSnapshot = await getDocs(lastMessageQuery);
        const lastMessage = lastMessageSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))[0];

        return {
          ...profile,
          lastMessage: lastMessage?.text || "No messages yet",
          matchId,
        };
      })
    );

    return matchWithLastMessages;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

const fetchUserProfiles = async (userIds) => {
  if (userIds.length === 0) return [];

  try {
    const q = query(collection(db, "Users"), where("__name__", "in", userIds));
    const querySnapshot = await getDocs(q);

    const profiles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return profiles;
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    return [];
  }
};

export { fetchMatchesWithLastMessages, fetchUserProfiles };
