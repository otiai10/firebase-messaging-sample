
const main = () => {

  firebase.initializeApp({
    messagingSenderId: "{{GCM_SENDER_ID}}"
  });
  const messaging = firebase.messaging();

  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
    window.alert("You've got a push notification successfully!\nBecause this tab is still active, `messaging.onMessage` fired.\n\n" + JSON.stringify(payload, null, 4));
  });

  const btnRequestPermission = document.querySelector("button#request-permission");
  btnRequestPermission.addEventListener("click", () => {
    messaging.requestPermission().then(() => {
      return messaging.getToken().then(token => {
        const body = JSON.stringify({token});
        fetch("/register", {method: "POST", body: body});
      });
    }).catch(err => console.log("[ERROR]", err));
  });

  const btnTrigger = document.querySelector("button#push");
  btnTrigger.addEventListener("click", () => {
    fetch("/trigger");
  });
};

window.onload = main;
