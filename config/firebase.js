import firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsSoW9KRqvMlV7iHZ2NNyNiXsrwZPpxHA",
  authDomain: "anonibus-thiago.firebaseapp.com",
  databaseURL: "https://anonibus-thiago.firebaseio.com",
  projectId: "anonibus-thiago",
  storageBucket: "anonibus-thiago.appspot.com",
  messagingSenderId: "577154091428",
  appId: "1:577154091428:web:05f3e01c34bc9f061bd931"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();