self.addEventListener('install', event => {
    console.log('Service worker installed');
  });
  
  self.addEventListener('fetch', event => {
    // Optionally, add custom fetch logic here
  });
  