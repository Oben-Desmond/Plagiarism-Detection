import   firebase from 'firebase';
 

var firebaseConfig = {
  apiKey: "AIzaSyB1xyD60ABxgR2V0IVskG2Ur_JrlIt8ZHY",
  authDomain: "ubreportsystem.firebaseapp.com",
  projectId: "ubreportsystem",
  storageBucket: "ubreportsystem.appspot.com",
  messagingSenderId: "147412839536",
  appId: "1:147412839536:web:0178ef077e20f17bdad8b5",
  measurementId: "G-73SZ6ZVZEE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


export default firebase;