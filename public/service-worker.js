importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

workbox.routing.registerRoute(
    ({request}) => ['image', 'document'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate()
)