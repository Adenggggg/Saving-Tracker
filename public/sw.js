self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Savings Circle", body: "Reminder" };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon.svg",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
