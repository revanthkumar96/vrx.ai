
import pool from '../config/database.js';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔧 Adding date columns to user_career_paths...');
    
    // Add start_date and end_date columns
    await client.query(`
      ALTER TABLE user_career_paths 
      ADD COLUMN IF NOT EXISTS start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;
    `);

    console.log('✅ Date columns added successfully.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    process.exit();
  }
}

migrate();
