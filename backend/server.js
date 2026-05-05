const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const commitRoutes = require('./routes/commitRoutes');

const app = express();
const PORT = Number(process.env.PORT || 8001);

// Log environment setup
console.log('Environment Setup:');
console.log('- GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✓ Set' : '✗ Not set');
console.log('- GEMINI_MODEL:', process.env.GEMINI_MODEL || 'gemini-pro (default)');
console.log('- PORT:', PORT);

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api', commitRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', provider: 'gemini' });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
