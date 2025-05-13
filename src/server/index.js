import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDataset } from '../api/dataset.js';
import { getSheriaHubCases, updateSheriaHubCases } from '../api/sheriahub.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running. Please use the React development server for the frontend.',
    endpoints: {
      dataset: '/api/dataset',
      sheriaHub: '/api/sheriahub/cases',
      health: '/health'
    }
  });
});

// API routes
app.get('/api/dataset', async (req, res) => {
  try {
    const dataset = await getDataset();
    res.json(dataset);
  } catch (error) {
    console.error('Error fetching dataset:', error);
    res.status(500).json({ error: 'Failed to fetch dataset' });
  }
});

app.get('/api/sheriahub/cases', async (req, res) => {
  try {
    const cases = await getSheriaHubCases();
    res.json(cases);
  } catch (error) {
    console.error('Error fetching SheriaHub cases:', error);
    res.status(500).json({ error: 'Failed to fetch SheriaHub cases' });
  }
});

app.post('/api/sheriahub/cases', async (req, res) => {
  try {
    const success = await updateSheriaHubCases(req.body);
    if (success) {
      res.json({ message: 'Cases updated successfully' });
    } else {
      res.status(500).json({ error: 'Failed to update cases' });
    }
  } catch (error) {
    console.error('Error updating SheriaHub cases:', error);
    res.status(500).json({ error: 'Failed to update cases' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running. Please use the React development server for the frontend.',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.path} does not exist.`,
    availableEndpoints: ['/', '/health', '/api/dataset', '/api/sheriahub/cases']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'Development'}`);
  console.log(`API available at http://localhost:${PORT}`);
}); 