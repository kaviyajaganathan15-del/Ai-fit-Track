const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { clientEncryption } = require('./models/User')

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>
  res.json({ success: true, message: 'AI FitTrack API is running' })
);

app.use('/api', routes);

// 404 handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` })
);

app.use(errorHandler);

module.exports = app;
