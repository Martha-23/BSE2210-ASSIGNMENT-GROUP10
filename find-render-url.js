const possibleUrls = [
  'https://group10-event-monolith-app.onrender.com',
  'https://group10-event-monolith-app-1.onrender.com', 
  'https://group10-event-monolith-app-2.onrender.com',
  'https://group10-event-monolith-app-3.onrender.com'
];

async function findRenderUrl() {
  console.log('Ì¥ç Finding your Render URL...\n');
  
  for (const url of possibleUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('‚úÖ FOUND YOUR APP:', url);
        console.log('   Message:', data.message);
        console.log('   Environment:', data.environment);
        return url;
      }
    } catch (error) {
      console.log('   ‚ùå Not found:', url);
    }
  }
  
  console.log('\n‚ùå Could not find your app automatically.');
  console.log('Ì≤° Please check your Render dashboard for the exact URL.');
  return null;
}

findRenderUrl();
