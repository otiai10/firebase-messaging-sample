importScripts("https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.4.0/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "{{GCM_SENDER_ID}}"
});

// "firebase.messaging" must be instantiated to enable background notification.
const messaging = firebase.messaging();

// This is an EventListener to customize background notification message.
// In case you pass "notification" to payload from your server, this handler
// is NOT called.
// See https://stackoverflow.com/questions/40462414/firebase-cloud-messaging-setbackgroundmessagehandler-not-called
// To use this handler, DO NOT pass "notification" field in the payload from server.
messaging.setBackgroundMessageHandler(function(payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/2.png",
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("install", ev => {
  console.log("[sw]", "Installed", ev)
})
