import pool from '../config/database.js';

async function recreateAllTables() {
  const client = await pool.connect();
  
  try {
    console.log('🚮 Dropping incorrect tables...');
    
    // Drop tables in correct order (child tables first)
    await client.query('DROP TABLE IF EXISTS user_goals');
    await client.query('DROP TABLE IF EXISTS daily_activity');
    await client.query('DROP TABLE IF EXISTS coding_stats');
    await client.query('DROP TABLE IF EXISTS user_profiles');
    
    console.log('✅ Dropped tables. Recreating with correct UUID schema...');

    // 1. user_profiles
    await client.query(`
      CREATE TABLE user_profiles (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        linkedin_handle VARCHAR(100),
        leetcode_handle VARCHAR(100),
        codechef_handle VARCHAR(100),
        codeforces_handle VARCHAR(100),
        height_cm DECIMAL(5,2),
        weight_kg DECIMAL(5,2),
        age INTEGER,
        gender VARCHAR(10),
        study_domain VARCHAR(100),
        study_year INTEGER,
        skills TEXT[]
      )
    `);
    console.log('✅ Created user_profiles (UUID)');

    // 2. coding_stats
    await client.query(`
      CREATE TABLE coding_stats (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        leetcode_solved INTEGER DEFAULT 0,
        codechef_solved INTEGER DEFAULT 0,
        codeforces_solved INTEGER DEFAULT 0,
        last_updated TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ Created coding_stats (UUID)');

    // 3. daily_activity
    await client.query(`
      CREATE TABLE daily_activity (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_date DATE NOT NULL,
        problems_solved INTEGER NOT NULL DEFAULT 1,
        UNIQUE(user_id, activity_date)
      )
    `);
    console.log('✅ Created daily_activity (UUID)');

    // 4. user_goals
    await client.query(`
      CREATE TABLE user_goals (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        monthly_coding_goal INTEGER DEFAULT 50,
        daily_study_goal_minutes INTEGER DEFAULT 60
      )
    `);
    console.log('✅ Created user_goals (UUID)');

    // Recreate Indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date);
      CREATE INDEX IF NOT EXISTS idx_daily_activity_date ON daily_activity(activity_date);
    `);
    console.log('✅ Recreated indexes');

  } catch (error) {
    console.error('❌ Error recreating tables:', error);
  } finally {
    client.release();
    pool.end();
  }
}

recreateAllTables();
