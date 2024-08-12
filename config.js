import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {initializeApp} from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCHuHEnp523AZqpk0HhCGozNZPFl0KvLdY',
  authDomain: 'rn-todo-b3cd8.firebaseapp.com',
  projectId: 'rn-todo-b3cd8',
  storageBucket: 'rn-todo-b3cd8.appspot.com',
  messagingSenderId: '695620092988',
  appId: '1:695620092988:web:037739a43f66715ccdaf39',
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase};
