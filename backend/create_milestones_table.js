import pool from './config/database.js';

async function createMilestonesTable() {
  let client;
  
  try {
    console.log('🔧 Creating milestones table for mental coach...');
    
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Create milestones table
    await client.query(`
      CREATE TABLE IF NOT EXISTS milestones (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        target_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON milestones(user_id);
      CREATE INDEX IF NOT EXISTS idx_milestones_completed ON milestones(completed);
      CREATE INDEX IF NOT EXISTS idx_milestones_category ON milestones(category);
    `);
    
    console.log('✅ Milestones table created successfully!');
    
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

createMilestonesTable();
