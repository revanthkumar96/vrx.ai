import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let client;
  
  try {
    console.log('🔧 Setting up database schema...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database_updates.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Connect to database
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Execute the SQL script
    await client.query(sql);
    console.log('✅ Database schema created successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

setupDatabase();
