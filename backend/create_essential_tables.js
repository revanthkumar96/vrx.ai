import pool from './config/database.js';

async function createEssentialTables() {
  let client;
  
  try {
    console.log('🔧 Creating essential database tables...');
    
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create user_profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create coding_stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS coding_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        leetcode_solved INTEGER DEFAULT 0,
        codechef_solved INTEGER DEFAULT 0,
        codeforces_solved INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create user_goals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create monthly_goals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS monthly_goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
        year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2030),
        daily_study_minutes INTEGER DEFAULT 0,
        leetcode_problems INTEGER DEFAULT 0,
        codechef_problems INTEGER DEFAULT 0,
        codeforces_problems INTEGER DEFAULT 0,
        contest_participation INTEGER DEFAULT 0,
        career_milestones INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, month, year)
      );
    `);
    
    // Create daily_activity_tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_activity_tracking (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
        study_minutes INTEGER DEFAULT 0,
        career_milestones_completed INTEGER DEFAULT 0,
        leetcode_solved INTEGER DEFAULT 0,
        codechef_solved INTEGER DEFAULT 0,
        codeforces_solved INTEGER DEFAULT 0,
        contests_participated INTEGER DEFAULT 0,
        total_problems_solved INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, activity_date)
      );
    `);
    
    // Create update_updated_at_column function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    console.log('✅ Essential database tables created successfully!');
    
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

createEssentialTables();
