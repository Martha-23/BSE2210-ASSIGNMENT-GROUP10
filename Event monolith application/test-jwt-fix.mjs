import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testJWT() {
  console.log('ÌæØ Testing JWT Fix\n');
  
  try {
    // 1. Create user with correct JWT secret
    console.log('1. Creating user...');
    const register = await axios.post(`${BASE_URL}/api/register`, {
      email: 'jwt_test@example.com',
      password: 'password123',
      role: 'ORGANIZER'
    });
    
    const token = register.data.token;
    console.log('‚úÖ User created');
    console.log('Ì¥ë Token length:', token.length);
    
    // 2. Test token validation
    console.log('2. Testing token validation...');
    const profile = await axios.get(`${BASE_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('‚úÖ Token validation successful!');
    console.log('Ì±§ User:', profile.data.email);
    console.log('Ìæ≠ Role:', profile.data.role);
    
    // 3. Create event (test organizer permissions)
    console.log('3. Testing event creation...');
    const event = await axios.post(`${BASE_URL}/api/events`, {
      title: 'JWT Fixed Event',
      description: 'Event created after JWT fix',
      date: '2024-12-20T18:00:00Z',
      location: 'Test Location'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('‚úÖ Event created:', event.data.title);
    console.log('\nÌæâ ALL SYSTEMS GO! JWT authentication is working perfectly!');
    
  } catch (error) {
    console.log('‚ùå Test failed:', error.response?.data || error.message);
  }
}

testJWT();
