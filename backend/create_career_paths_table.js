import pool from './config/database.js';

async function createCareerPathsTable() {
  let client;
  
  try {
    console.log('🔧 Creating career_paths table for mental coach...');
    
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Create career_paths table
    await client.query(`
      CREATE TABLE IF NOT EXISTS career_paths (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        current_role_col VARCHAR(255),
        target_role VARCHAR(255),
        skills_required TEXT,
        progress_percentage INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_career_paths_user_id ON career_paths(user_id);
      CREATE INDEX IF NOT EXISTS idx_career_paths_status ON career_paths(status);
    `);
    
    console.log('✅ Career paths table created successfully!');
    
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

createCareerPathsTable();
