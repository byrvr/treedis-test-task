import express from 'express';
import cors from 'cors';
import { ParsedQs } from 'qs';

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

// POST endpoint for search
app.use(express.json()); // Add middleware to parse JSON bodies

app.post('/api/search', (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: "Query parameter 'query' is required and must be a string" });
  }

  const results = menuItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  res.json(results);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
