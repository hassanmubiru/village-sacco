// # Service worker registration for the Village SACCO app
// # This will cache assets for faster loading even when offline

name = 'village-sacco-sw'
type = 'module'

[[runtimeCaching]]
urlPattern = '/'
handler = 'NetworkFirst'
options = { networkTimeoutSeconds: 10 }

[[runtimeCaching]]
urlPattern = '/governance'
handler = 'NetworkFirst'
options = { networkTimeoutSeconds: 10 }

[[runtimeCaching]]
urlPattern = '/admin'
handler = 'NetworkFirst'
options = { networkTimeoutSeconds: 10 }

[[runtimeCaching]]
urlPattern = '/((?!api).*)'
handler = 'NetworkFirst'
options = { cacheName: 'pages', networkTimeoutSeconds : 10 }

[[runtimeCaching]]
urlPattern = '/api/((?!auth).*)' 
handler = 'NetworkFirst'
options = { cacheName: 'api-cache', networkTimeoutSeconds : 10 }

[[runtimeCaching]]
urlPattern = '^https://fonts.(?:googleapis|gstatic).com/(.*)' 
handler = 'CacheFirst'
options = { cacheName: 'google-fonts', expiration: { maxEntries : 30, maxAgeSeconds : 60 * 60 * 24 * 365 } }

[[runtimeCaching]]
urlPattern = '.*\\.(?:png|jpg|jpeg|svg|gif|webp)'
handler = 'CacheFirst'
options = { cacheName: 'images', expiration: { maxEntries : 50, maxAgeSeconds : 60 * 60 * 24 * 30 } }
