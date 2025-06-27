/**
 * Script to preload critical routes for the Village SACCO app
 * This helps with initial page load performance by pre-generating HTML
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CRITICAL_ROUTES = [
  '/',
  '/governance',
  '/admin',
  '/savings',
  '/loans'
];

console.log('🔄 Preloading critical routes...');

// Create directory for preloaded content
const preloadDir = path.join(__dirname, '..', '.next', 'preloaded');
if (!fs.existsSync(preloadDir)) {
  fs.mkdirSync(preloadDir, { recursive: true });
}

// Function to preload a route
async function preloadRoute(route) {
  const url = new URL(route, BASE_URL).toString();
  console.log(`⚡ Preloading: ${url}`);
  
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to preload ${url}: ${response.statusCode}`));
        return;
      }
      
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        const filePath = path.join(
          preloadDir, 
          route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`
        );
        
        fs.writeFileSync(filePath, data);
        console.log(`✅ Preloaded: ${route} → ${filePath}`);
        resolve();
      });
    });
    
    request.on('error', (error) => {
      console.error(`❌ Error preloading ${url}: ${error.message}`);
      reject(error);
    });
    
    request.end();
  });
}

// Preload all critical routes
async function preloadAllRoutes() {
  try {
    await Promise.all(CRITICAL_ROUTES.map(preloadRoute));
    console.log('✨ All critical routes preloaded successfully!');
  } catch (error) {
    console.error('❌ Failed to preload routes:', error);
    process.exit(1);
  }
}

preloadAllRoutes();
