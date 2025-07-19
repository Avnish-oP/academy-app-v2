const CACHE_NAME = 'academypro-v3';
const STATIC_CACHE = 'academypro-static-v3';
const DYNAMIC_CACHE = 'academypro-dynamic-v3';

const staticAssets = [
  '/',
  '/home',
  '/courses',
  '/notifications',
  '/updates',
  '/login',
  '/admin',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

const dynamicAssets = [
  '/api/notifications',
  '/api/updates',
  '/api/classes',
  '/api/materials'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(staticAssets);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Dynamic cache created');
        return cache;
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve cached content with network-first strategy for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST, PUT, DELETE, etc.) - these cannot be cached
  if (request.method !== 'GET') {
    console.log('Service Worker: Skipping non-GET request:', request.method, url.pathname);
    return; // Let the request go through without service worker intervention
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Skip authentication and sensitive API routes
  const skipAuthPaths = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/verify',
    '/api/admin/users',
    '/api/admin/notifications'
  ];

  if (skipAuthPaths.some(path => url.pathname.startsWith(path))) {
    console.log('Service Worker: Skipping auth route:', url.pathname);
    return; // Let auth requests go through without caching
  }

  // Handle API requests with network-first strategy (only GET requests)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful GET responses
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone).catch((error) => {
                console.log('Service Worker: Failed to cache API response:', error);
              });
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses or non-GET requests
        if (!response || response.status !== 200 || response.type !== 'basic' || request.method !== 'GET') {
          return response;
        }

        // Clone the response before caching
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone).catch((error) => {
            console.log('Service Worker: Failed to cache static response:', error);
          });
        });

        return response;
      });
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let notificationData = {
    title: 'Academy Pro',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'academy-notification',
    data: {
      url: '/notifications'
    }
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/icon-72x72.png'
        }
      ],
      vibrate: [200, 100, 200],
      requireInteraction: true
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  event.notification.close();

  if (event.action === 'view') {
    const urlToOpen = event.notification.data?.url || '/notifications';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if no existing one found
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync data when connection is restored
      fetch('/api/notifications')
        .then(response => response.json())
        .then(data => {
          console.log('Background sync completed');
        })
        .catch(error => {
          console.log('Background sync failed:', error);
        })
    );
  }
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle errors
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
  event.preventDefault(); // Prevent the error from bubbling up
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent the rejection from bubbling up
  
  // If it's a cache-related error, log it but don't let it break the app
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('Request method') || 
       event.reason.message.includes('Cache'))) {
    console.log('Service Worker: Cache operation failed, continuing without caching');
  }
});
