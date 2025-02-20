import express from 'express';
import cors from 'cors';

const app = express();
const port = 5001;

// Enable CORS for frontend requests
app.use(cors());

// Menu items data (hardcoded for now)
const menuItems = [
  {
    id: 1,
    name: "Teleport to office",
    function: "handleTeleport"
  },
  {
    id: 2,
    name: "Navigate to office",
    function: "handleNavigate"
  }
];

// GET endpoint for menu items
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
