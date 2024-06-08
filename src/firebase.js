// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: 'airbnba.firebaseapp.com',
  projectId: 'airbnba',
  storageBucket: 'airbnba.appspot.com',
  messagingSenderId: '1091878776592',
  appId: '1:1091878776592:web:50f9b70c3aaf173798ff95',
  measurementId: 'G-DWMNDBMQNM',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
