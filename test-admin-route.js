// Quick test to verify admin application route
const express = require('express');
const app = express();

app.use(express.json());

// Test route
app.put('/api/admin/applications/:applicationId/status', (req, res) => {
  console.log('Route hit!');
  console.log('Application ID:', req.params.applicationId);
  console.log('Body:', req.body);
  res.json({ message: 'Route working!' });
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
  console.log('Test URL: PUT http://localhost:3001/api/admin/applications/test123/status');
});