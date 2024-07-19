import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function MessageDetail({ route }) {
  const { matchId, userName } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(
        collection(db, "Messages"),
        where("matchId", "==", matchId),
        orderBy("timestamp")
      );
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    };

    fetchMessages();
  }, [matchId]);

  const handleSend = async () => {
    if (newMessage.trim() === "") return;
    try {
      const currentUserUid = auth.currentUser.uid;
      await addDoc(collection(db, "Messages"), {
        matchId,
        senderId: currentUserUid,
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage("");
      // Fetch messages again to include the new message
      const q = query(
        collection(db, "Messages"),
        where("matchId", "==", matchId),
        orderBy("timestamp")
      );
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 45 : 0}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Chat with {userName}</Text>
      </View>
      <KeyboardAwareFlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={
              item.senderId === auth.currentUser.uid
                ? styles.myMessage
                : styles.theirMessage
            }
          >
            <Text
              style={
                item.senderId === auth.currentUser.uid
                  ? styles.myMessageText
                  : styles.theirMessageText
              }
            >
              {item.text}
            </Text>
          </View>
        )}
        inverted
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#1cb8c4",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: "80%",
  },
  myMessageText: {
    color: "#fff",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: "80%",
  },
  theirMessageText: {
    color: "#000",
  },
});
