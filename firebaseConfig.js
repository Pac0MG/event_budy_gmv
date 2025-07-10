// firebaseConfig.js

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAVI6mAm9ex2l130wiibWej1RnM_G-uo8M",
  authDomain: "db-af40c.firebaseapp.com",
  projectId: "db-af40c",
  storageBucket: "db-af40c.appspot.com",
  messagingSenderId: "656229645386",
  appId: "1:656229645386:web:ee170e04fe98d6851a7ab3",
  measurementId: "G-QSDQYQ258D"
};

// Inicializar se ainda não estiver inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exportações
const auth = firebase.auth();
const database = firebase.firestore();

export { firebase, auth, database };
