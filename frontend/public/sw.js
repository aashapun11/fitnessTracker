// /public/sw.js

// When push notification is received
self.addEventListener("push", function(event) {
  const data = event.data.json(); // server sends JSON

  const options = {
    body: data.message,           // notification text
    icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",         // small icon
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Listen for notification click
self.addEventListener("notificationclick", async (event) => {
  event.notification.close(); // Close the popup

  event.waitUntil((async () => {

  const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
  let isLoggedIn = false;

  // Ask all open clients about login status
  const loginPromises = allClients.map(client => {
    return new Promise(resolve => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (msgEvent) => {
        if (msgEvent.data.type === "LOGIN_STATUS") {
          resolve(msgEvent.data.isLoggedIn);
        }
      };
      client.postMessage({ type: "CHECK_LOGIN" }, [messageChannel.port2]);
    });
  });

  const results = await Promise.all(loginPromises);
  if (results.includes(true)) isLoggedIn = true;

  // Decide which URL to open
  const targetUrl = isLoggedIn ? "/smart-nutrition" : "/login";

  // Check if any tab is already open for our app
  const clientAlreadyOpen = allClients.find(client => client.url.includes(targetUrl));
  if (clientAlreadyOpen) {
    return clientAlreadyOpen.focus();
  } else {
    return event.waitUntil(clients.openWindow(targetUrl));
  }
    })());

});