import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Create upload directories if they don't exist
const dirs = ['uploads', 'uploads/blogs', 'uploads/projects'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/blogs', (await import('./routes/blogRoutes.js')).default);
app.use('/api/contact', (await import('./routes/contactRoutes.js')).default);
app.use('/api/projects', (await import('./routes/projectRoutes.js')).default);
app.use('/api/auth', (await import('./routes/authRoutes.js')).default);

// For production - serve static assets from the build folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));