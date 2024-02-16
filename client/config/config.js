import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBHqNeJuRcPfdvwZpL1HRjP8-FkR52-sxY",
    authDomain: "educat-auth.firebaseapp.com",
    projectId: "educat-auth",
    storageBucket: "educat-auth.appspot.com",
    messagingSenderId: "628725081553",
    appId: "1:628725081553:web:be5940fcc76c50fbea6cf0"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}


export { firebase };