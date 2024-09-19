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
            // Now that permission is granted, get the token
            getTokenAndHandle();
        } else {
            console.log('Notification permission denied.');
        }
    });
}

function getTokenAndHandle() {
    getToken(messaging, { vapidKey: 'BOYVGpgQgNfYW5Zv6ODdPdPVtU0I1Q7ohU9M9mVobqPhb7E-Qb_VfJodMfXq32ULj6DvMJHJLisGHyQ4-IjJK1U' }).then((currentToken) => {
        if (currentToken) {
            console.log(currentToken);
            const data = {
                "token": currentToken
            }
            fetch('/api/resource/TIM User Notif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Token saved successfully:', data);
            })
            .catch(error => {
                console.error('Error saving token:', error);
            });

        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
}

document.getElementById('enable-notifications-button').addEventListener('click', function() {
    document.getElementById('notification-permission').style.display = 'none';
    requestPermission();
});

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('notification-permission').style.display = 'none';
});

if (Notification.permission === 'granted') {

} else {
    document.getElementById('notification-permission').style.display = 'flex';
}
       
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js', { type: 'module' })
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}