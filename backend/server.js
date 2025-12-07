import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { pool } from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import dashboardRoutes from './routes/dashboard.js';
import trackerRoutes from './routes/tracker.js';
import scrapeRoutes from './routes/scrape.js';
import activityRoutes from './routes/activity.js';
import careerCompanionRoutes from './routes/careerCompanion.js';
import roadmapRoutes from './routes/roadmaps.js';
import progressRoutes from './routes/progress.js';
import goalsRoutes from './routes/goals.js';
import assignmentRoutes from './routes/assignments.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:8082'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({
      status: 'success',
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/career-companion', careerCompanionRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/goals', goalsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Aura Synergy Hub Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      dashboard: '/api/dashboard',
      tracker: '/api/tracker',
      goals: '/api/goals',
      scrape: '/api/scrape',

      roadmaps: '/api/roadmaps',
      progress: '/api/progress',
      activity: '/api/activity',
      health: '/health',
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Database initialization function
async function ensureColumnsExist() {
  let client;
  try {
    client = await pool.connect();
    console.log('🔧 Checking database schema...');
    
    // Create tables if they don't exist
    const createTablesQuery = `
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create user_profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        height_cm INTEGER,
        weight_kg INTEGER,
        age INTEGER,
        gender VARCHAR(20),
        study_domain VARCHAR(255),
        skills TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create coding_stats table
      CREATE TABLE IF NOT EXISTS coding_stats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        leetcode_solved INTEGER DEFAULT 0,
        codechef_solved INTEGER DEFAULT 0,
        codeforces_solved INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create chat_history table
      CREATE TABLE IF NOT EXISTS chat_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create indexes for chat_history
      CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at);
    `;
    
    await client.query(createTablesQuery);
    console.log('✅ Database schema verified');
    
  } catch (error) {
    console.error('❌ Database schema error:', error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Vrx.ai Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Ensure database columns exist on startup (with delay to avoid connection conflicts)
  setTimeout(async () => {
    try {
      await ensureColumnsExist();
    } catch (error) {
      console.log('⚠️ Migration skipped due to connection limits - will retry on next request');
    }
  }, 2000);
});

export default app;
