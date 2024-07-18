import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBgNx4cfrYsG-7Pw5auvOSdPf9WlPLCSHM",
  authDomain: "yacht-teams.firebaseapp.com",
  projectId: "yacht-teams",
  storageBucket: "yacht-teams.appspot.com",
  messagingSenderId: "245063412732",
  appId: "1:245063412732:web:779dd022702003a96ba079",
  measurementId: "G-B2E6GP6RBW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, firebaseConfig, storage };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
