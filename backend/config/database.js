import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Debug: Log the connection string (without password)
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log('🔗 Database URL:', maskedUrl);
} else {
  console.error('❌ DATABASE_URL not found in environment variables');
}

// SSL configuration - force disable SSL validation for Aiven Cloud
const sslConfig = process.env.NODE_ENV === 'production' ? true : { 
  rejectUnauthorized: false 
};
console.log('🔧 SSL configured with rejectUnauthorized: false for development');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 5,
  min: 1,
  acquireTimeoutMillis: 10000,
  createTimeoutMillis: 10000,
  destroyTimeoutMillis: 3000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200
});

// Test the connection with better error handling
pool.on('connect', (client) => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err, client) => {
  console.error('❌ PostgreSQL connection error:', err.message);
  if (err.code === 'ETIMEDOUT') {
    console.error('🔄 Connection timed out - check if database server is running and accessible');
  }
});

// Test connection on startup
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection test successful');
    client.release();
  } catch (err) {
    console.error('❌ Database connection test failed:', err.message);
    if (err.code === 'ETIMEDOUT') {
      console.error('💡 Suggestion: Verify your database connection string and server status in Aiven console');
    }
  }
}

// Remove automatic connection testing to prevent polling issues
// setTimeout(testConnection, 2000);

export { pool };
export default pool;
