//import firebase from "firebase";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage, ref} from 'firebase/storage';
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyCV-1YPgXc3ATVKerbztpWaYVaFJ0ho5f4",
    authDomain: "khelkonnect.firebaseapp.com",
    projectId: "khelkonnect",
    storageBucket: "khelkonnect.appspot.com",
    messagingSenderId: "703134666997",
    appId: "1:703134666997:web:c804c627206162d5bb75bc",
    measurementId: "G-VPNFYBWSTM"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  //const db = firebaseApp.firestore();
  const db = getFirestore(firebaseApp);
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  //const storage = firebase.storage();
  //const storage = require('@google-cloud/storage');
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage);

  export {auth, provider, storage};
  export default db;