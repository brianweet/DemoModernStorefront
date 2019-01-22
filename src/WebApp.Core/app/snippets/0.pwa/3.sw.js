if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  //...
  workbox.routing.registerRoute(
    "/",
    workbox.strategies.networkFirst({
      cacheName: "homepage-cache"
    })
  );
  workbox.routing.registerRoute(
    new RegExp(".*.js"),
    workbox.strategies.networkFirst({
      cacheName: "js-cache",
      networkTimeoutSeconds: 3
    })
  );
  //...
}

