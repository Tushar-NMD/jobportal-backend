// Quick test script
const testRoutes = () => {
  console.log('Testing routes...');
  
  // First login to get token
  fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'password123'
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Login response:', data);
    
    if (data.success && data.data.token) {
      const token = data.data.token;
      
      // Test PUT /profile-pic
      return fetch('http://localhost:5000/api/admin/profile-pic', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profilePic: 'https://example.com/test.jpg'
        })
      });
    } else {
      throw new Error('Login failed');
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log('Update profile pic response:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
};

testRoutes();
