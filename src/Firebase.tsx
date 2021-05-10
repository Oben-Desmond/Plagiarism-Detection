import   firebase from 'firebase';
 


const config  = {
    apiKey: "AIzaSyDF-dYpSw-Ym2iPkP3O2p3Ce0WMR0I47Po",
    authDomain: "quesers-app.firebaseapp.com",
    databaseURL: "https://quesers-app-default-rtdb.firebaseio.com",
    projectId: "quesers-app",
    storageBucket: "quesers-app.appspot.com",
    messagingSenderId: "255868662577",
    appId: "1:255868662577:web:72b4d402586b566854f610",
    measurementId: "G-R95FFDEGC0"
  };
firebase.initializeApp(config);

export default firebase;