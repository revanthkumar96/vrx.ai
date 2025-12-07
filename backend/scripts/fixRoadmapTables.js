import pool from '../config/database.js';

async function fixRoadmapTables() {
  const client = await pool.connect();
  
  try {
    console.log('🛠️ Fixing roadmap-related tables...');

    // 1. user_career_paths
    console.log('Processing user_career_paths...');
    await client.query('DROP TABLE IF EXISTS user_career_paths CASCADE');
    await client.query(`
      CREATE TABLE user_career_paths (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          roadmap_id INTEGER NOT NULL,
          roadmap_name VARCHAR(255) NOT NULL,
          selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          progress INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created user_career_paths (UUID)');

    // 2. user_module_progress
    console.log('Processing user_module_progress...');
    await client.query('DROP TABLE IF EXISTS user_module_progress CASCADE');
    await client.query(`
      CREATE TABLE user_module_progress (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          roadmap_id INTEGER NOT NULL,
          module_name VARCHAR(500) NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          completed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, roadmap_id, module_name)
      )
    `);
    console.log('✅ Created user_module_progress (UUID)');

    // 3. user_daily_streaks
    // Note: There was a potential conflict with 'user_daily_streaks' vs 'user_daily_streaks_detailed'.
    // We will stick to the definition found in roadmaps.js as it seems to be the primary one for this feature set.
    console.log('Processing user_daily_streaks...');
    await client.query('DROP TABLE IF EXISTS user_daily_streaks CASCADE');
    await client.query(`
      CREATE TABLE user_daily_streaks (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          streak_date DATE NOT NULL,
          modules_completed INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, streak_date)
      )
    `);
    console.log('✅ Created user_daily_streaks (UUID)');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_career_paths_user_id ON user_career_paths(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_career_paths_active ON user_career_paths(user_id, is_active);
      CREATE INDEX IF NOT EXISTS idx_user_module_progress_user_roadmap ON user_module_progress(user_id, roadmap_id);
      CREATE INDEX IF NOT EXISTS idx_user_module_progress_completed ON user_module_progress(user_id, completed);
      CREATE INDEX IF NOT EXISTS idx_user_daily_streaks_user_date ON user_daily_streaks(user_id, streak_date);
    `);
    console.log('✅ Created indexes');

    // Add learning_streak to users if missing
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS learning_streak INTEGER DEFAULT 0;
    `);
    console.log('✅ Verified learning_streak column in users');

  } catch (error) {
    console.error('❌ Error fixing roadmap tables:', error);
  } finally {
    client.release();
    pool.end();
  }
}

fixRoadmapTables();
