self.addEventListener("push", (event) => {

    const notif = event.data.json().notification;

    event.waitUntil(self.registration.showNotification(notif.title , {
        body: notif.body,
        icon: notif.image,
        data: {
            url: notif.click_action
        }
    }));

});

self.addEventListener("notificationclick", (event) => {

    event.waitUntil(clients.openWindow(event.notification.data.url));

});
/*const firebaseConfig = {
    apiKey: "AIzaSyBOLWhMz6Y-3ZDOsdDganfe_IgZ2EHVy7I",
    authDomain: "fcm-test-vms.firebaseapp.com",
    projectId: "fcm-test-vms",
    storageBucket: "fcm-test-vms.appspot.com",
    messagingSenderId: "371944477076",
    appId: "1:371944477076:web:dc8d35e831d321b83d7f81",
    measurementId: "G-VYFH89DLHH"
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/files/TIM Logo.jpeg'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});*/
