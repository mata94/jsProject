import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDSZSTAqxrTxjFtY7VbJUkDYNXtQxQKa48",
    authDomain: "elearning-11630.firebaseapp.com",
    projectId: "elearning-11630",
    storageBucket: "elearning-11630.appspot.com",
    messagingSenderId: "1010008038158",
    appId: "1:1010008038158:web:9ea5d738808594816ad55f"
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  
  export { firestore, auth, storage };
  