const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and allow frontend requests
app.use(cors());
app.use(express.json());

// Temporary mock data for third-place locations
let locations = [
  { id: 1, name: "Downtown Makerspace", hobby: "3D Printing", city: "Fullerton" },
  { id: 2, name: "Central Park Chess Tables", hobby: "Chess", city: "Fullerton" }
];

// GET route: Retrieve data (Frontend will call this to display pins on the map)
app.get('/api/locations', (req, res) => {
  res.json(locations);
});

// POST route: Send data (Frontend will call this when a user submits a new location)
app.post('/api/locations', (req, res) => {
  const newLocation = req.body;
  
  // Assign a temporary ID
  newLocation.id = locations.length + 1;
  locations.push(newLocation);
  
  res.status(201).json({ 
    message: "New third-place location successfully added!", 
    location: newLocation 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Orbit API Server is running on http://localhost:${PORT}`);
});
