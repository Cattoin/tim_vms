import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOLWhMz6Y-3ZDOsdDganfe_IgZ2EHVy7I",
    authDomain: "fcm-test-vms.firebaseapp.com",
    projectId: "fcm-test-vms",
    storageBucket: "fcm-test-vms.appspot.com",
    messagingSenderId: "371944477076",
    appId: "1:371944477076:web:dc8d35e831d321b83d7f81",
    measurementId: "G-VYFH89DLHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });
}
requestPermission();
getToken(messaging, { vapidKey: 'BOYVGpgQgNfYW5Zv6ODdPdPVtU0I1Q7ohU9M9mVobqPhb7E-Qb_VfJodMfXq32ULj6DvMJHJLisGHyQ4-IjJK1U' }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      console.log(currentToken);
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
       
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}
