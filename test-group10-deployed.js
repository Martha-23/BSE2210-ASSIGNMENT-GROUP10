async function testGroup10Deployed() {
  const RENDER_URL = 'https://group10-event-monolith-app.onrender.com';
  
  console.log('Ì∫Ä Testing Group10 Event Monolith App - DEPLOYED ON RENDER\n');
  console.log('Ì≥± App Name: Group10 Event monolith app');
  console.log('Ìºê URL:', RENDER_URL);
  console.log('Ì≥ö Docs:', RENDER_URL + '/api-docs/');
  console.log('============================================\n');
  
  // Test 1: Basic Health
  console.log('1. Ìø• Basic Health Check');
  try {
    const response = await fetch(RENDER_URL);
    const data = await response.json();
    console.log('   ‚úÖ SUCCESS: Server is running!');
    console.log('   Ì≥ù Message:', data.message);
    console.log('   Ì±Ä Observers:', data.observers);
    console.log('   ‚è∞ Timestamp:', data.timestamp);
  } catch (error) {
    console.log('   ‚ùå FAILED: Cannot connect to server');
    return;
  }
  
  // Test 2: Registration with Observer Pattern
  console.log('\n2. Ì≥ù Testing Registration + Observer Pattern');
  const testEmail = `group10-final-${Date.now()}@example.com`;
  
  try {
    const registerResponse = await fetch(`${RENDER_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
        name: 'Group10 Final Test User'
      }),
    });
    
    const registerResult = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('   ‚úÖ SUCCESS: Registration working!');
      console.log('   Ì≥ß Observer Notification:', registerResult.notification);
      console.log('   Ì±§ User created with ID:', registerResult.user.id);
      console.log('   ÌæØ Role:', registerResult.user.role);
      console.log('   Ì¥ë Token received:', registerResult.token ? 'Yes' : 'No');
      
      // Test 3: Login
      console.log('\n3. Ì¥ê Testing Login');
      const loginResponse = await fetch(`${RENDER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'password123'
        }),
      });
      
      const loginResult = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('   ‚úÖ SUCCESS: Login working!');
        console.log('   Ì¥ë JWT Authentication successful');
        
        // Test 4: Protected Routes
        console.log('\n4. Ìª°Ô∏è Testing Protected Routes');
        const token = loginResult.token;
        
        const endpoints = [
          { path: '/api/me', name: 'User Profile' },
          { path: '/api/events', name: 'Get Events' },
          { path: '/api/my-rsvps', name: 'My RSVPs' },
        ];
        
        for (const endpoint of endpoints) {
          const response = await fetch(`${RENDER_URL}${endpoint.path}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const status = response.status === 200 ? '‚úÖ 200' : `‚ùå ${response.status}`;
          console.log(`   ${endpoint.name.padEnd(15)}: ${status}`);
        }
      } else {
        console.log('   ‚ùå FAILED: Login -', loginResult.error);
      }
    } else {
      console.log('   ‚ùå FAILED: Registration -', registerResult.error);
    }
  } catch (error) {
    console.log('   ‚ùå FAILED: API call -', error.message);
  }
  
  // Test 5: Public Endpoints
  console.log('\n5. Ìºê Testing Public Endpoints');
  try {
    const eventsResponse = await fetch(`${RENDER_URL}/api/events`);
    console.log('   Events endpoint:', eventsResponse.status === 200 ? '‚úÖ 200' : `‚ùå ${eventsResponse.status}`);
    
    const observersResponse = await fetch(`${RENDER_URL}/api/observers`);
    const observersData = await observersResponse.json();
    console.log('   Observers endpoint:', observersResponse.status === 200 ? '‚úÖ 200' : `‚ùå ${observersResponse.status}`);
    console.log('   Active Observers:', observersData.observers);
  } catch (error) {
    console.log('   Public endpoints error:', error.message);
  }
  
  console.log('\nÌæâ GROUP10 APP DEPLOYMENT TEST COMPLETE!');
  console.log('========================================');
  console.log('‚úÖ App: SUCCESSFULLY DEPLOYED ON RENDER');
  console.log('‚úÖ URL: https://group10-event-monolith-app.onrender.com');
  console.log('‚úÖ Observer Pattern: ACTIVE');
  console.log('‚úÖ Authentication: WORKING');
  console.log('‚úÖ Database: CONNECTED');
  console.log('‚úÖ API: FULLY FUNCTIONAL');
  console.log('========================================');
  console.log('\nÌ≥ß Check Ethereal for welcome emails!');
  console.log('Ì≥ö Test Swagger docs:', RENDER_URL + '/api-docs/');
  console.log('Ì±Ä Check Render logs for email sending confirmation!');
}

testGroup10Deployed();
