import pool from '../config/database.js';

async function createActivityTables() {
  const client = await pool.connect();
  
  try {
    console.log('🛠️ Creating activity tracking tables...');

    // 1. Create monthly_goals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS monthly_goals (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
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
    console.log('✅ Created monthly_goals table');

    // 2. Create daily_activity_tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_activity_tracking (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        activity_date DATE NOT NULL,
        study_minutes INTEGER DEFAULT 0,
        leetcode_solved INTEGER DEFAULT 0,
        codechef_solved INTEGER DEFAULT 0,
        codeforces_solved INTEGER DEFAULT 0,
        contests_participated INTEGER DEFAULT 0,
        career_milestones_completed INTEGER DEFAULT 0,
        total_problems_solved INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, activity_date)
      );
    `);
    console.log('✅ Created daily_activity_tracking table');

    // 3. Create user_streak_tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_streak_tracking (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        streak_date DATE NOT NULL,
        
        -- Streak Counts
        leetcode_streak INTEGER DEFAULT 0,
        codechef_streak INTEGER DEFAULT 0,
        codeforces_streak INTEGER DEFAULT 0,
        career_streak INTEGER DEFAULT 0,
        study_streak INTEGER DEFAULT 0,
        coding_streak INTEGER DEFAULT 0,
        overall_streak INTEGER DEFAULT 0,
        
        -- Activity Flags (Boolean represented as Boolean or Integer, using Boolean here)
        had_leetcode_activity BOOLEAN DEFAULT FALSE,
        had_codechef_activity BOOLEAN DEFAULT FALSE,
        had_codeforces_activity BOOLEAN DEFAULT FALSE,
        had_career_activity BOOLEAN DEFAULT FALSE,
        had_study_activity BOOLEAN DEFAULT FALSE,
        had_any_activity BOOLEAN DEFAULT FALSE,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, streak_date)
      );
    `);
    console.log('✅ Created user_streak_tracking table');

    console.log('🎉 All activity tracking tables created successfully');

  } catch (error) {
    console.error('❌ Error creating activity tables:', error);
  } finally {
    client.release();
    pool.end();
  }
}

createActivityTables();
