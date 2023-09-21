// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDjHmjlXHDtr0a1jKzWNxfg0WUHxJj5ahs",
	authDomain: "moments-by-gisore.firebaseapp.com",
	projectId: "moments-by-gisore",
	storageBucket: "moments-by-gisore.appspot.com",
	messagingSenderId: "995396662347",
	appId: "1:995396662347:web:d224026be6b7daae5849ce",
	measurementId: "G-X3N8PQLMGL",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
// const analytics = getAnalytics(app);
export { app, auth };