if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  //...
  // Enable offline profile store tracking
  workbox.routing.registerRoute(
    new RegExp("^https://track-emea01.profilestore.episerver.net/api/v1.0/"),
    workbox.strategies.networkOnly({
      plugins: [
        new workbox.backgroundSync.Plugin("background-sync-queue", {
          maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
        })
      ]
    }),
    "POST"
  );
  workbox.googleAnalytics.initialize();
  //...
}
