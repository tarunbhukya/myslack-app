 import firebase from 'firebase/app'
 require('firebase/auth')
 require('firebase/storage')
 require('firebase/database')
 
 
 // Your web app's Firebase configuration
 var firebaseConfig = {
    
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;