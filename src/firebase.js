import firebase from "firebase";
import "firebase/auth";
import "firebase/app";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDI7XUzJrxG2YTVW2vP_fmpPnJuqKLBcYE",
  authDomain: "todoist-2b1b3.firebaseapp.com",
  projectId: "todoist-2b1b3",
  storageBucket: "todoist-2b1b3.appspot.com",
  messagingSenderId: "156621668813",
  appId: "1:156621668813:web:e0865415ea08319bb74484",
  measurementId: "G-D2Q9G93LC9",
};
firebase.initializeApp(firebaseConfig);
export var auth = firebase.auth();
export var db = firebase.firestore();
export var fb = firebase;
