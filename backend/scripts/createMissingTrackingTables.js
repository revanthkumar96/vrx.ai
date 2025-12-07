import pool from '../config/database.js';

async function createMissingTrackingTables() {
  const client = await pool.connect();
  
  try {
    console.log('🛠️ Creating missing tracking and activity tables...');

    // 1. Career Paths & Milestones (Dependencies)
    await client.query(`
      CREATE TABLE IF NOT EXISTS career_paths (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(10) DEFAULT '🛣️',
        difficulty VARCHAR(50) DEFAULT 'Intermediate',
        estimated_duration VARCHAR(100),
        progress INTEGER DEFAULT 0,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        is_template BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created career_paths table');

    await client.query(`
      CREATE TABLE IF NOT EXISTS milestones (
        id SERIAL PRIMARY KEY,
        career_path_id INTEGER REFERENCES career_paths(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        due_date DATE,
        estimated_time VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created milestones table');

    await client.query(`
      CREATE TABLE IF NOT EXISTS milestone_skills (
        id SERIAL PRIMARY KEY,
        milestone_id INTEGER REFERENCES milestones(id) ON DELETE CASCADE,
        skill_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created milestone_skills table');

    await client.query(`
      CREATE TABLE IF NOT EXISTS milestone_resources (
        id SERIAL PRIMARY KEY,
        milestone_id INTEGER REFERENCES milestones(id) ON DELETE CASCADE,
        resource_name VARCHAR(255) NOT NULL,
        resource_url VARCHAR(500),
        resource_type VARCHAR(50) DEFAULT 'link',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created milestone_resources table');

    // 2. Comprehensive Tracking Tables
    
    // Monthly Progress Summary (The one causing the error)
    await client.query(`
      CREATE TABLE IF NOT EXISTS monthly_progress_summary (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
        year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2030),
        total_study_minutes INTEGER DEFAULT 0,
        total_leetcode_solved INTEGER DEFAULT 0,
        total_codechef_solved INTEGER DEFAULT 0,
        total_codeforces_solved INTEGER DEFAULT 0,
        total_contests_participated INTEGER DEFAULT 0,
        total_career_milestones INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        study_progress_percent DECIMAL(5,2) DEFAULT 0,
        leetcode_progress_percent DECIMAL(5,2) DEFAULT 0,
        codechef_progress_percent DECIMAL(5,2) DEFAULT 0,
        codeforces_progress_percent DECIMAL(5,2) DEFAULT 0,
        contest_progress_percent DECIMAL(5,2) DEFAULT 0,
        career_progress_percent DECIMAL(5,2) DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, month, year)
      );
    `);
    console.log('✅ Created monthly_progress_summary table');

    // Daily User Progress
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_user_progress (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
        career_path_id INTEGER REFERENCES career_paths(id) ON DELETE SET NULL,
        milestones_completed INTEGER DEFAULT 0,
        study_time_minutes INTEGER DEFAULT 0,
        leetcode_problems_solved INTEGER DEFAULT 0,
        codechef_problems_solved INTEGER DEFAULT 0,
        codeforces_problems_solved INTEGER DEFAULT 0,
        codeforces_contest_problems INTEGER DEFAULT 0,
        codechef_contest_problems INTEGER DEFAULT 0,
        total_problems_solved INTEGER DEFAULT 0,
        total_contest_problems INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, activity_date)
      );
    `);
    console.log('✅ Created daily_user_progress table');

    // User Milestone Completions
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_milestone_completions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        career_path_id INTEGER NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
        milestone_id INTEGER NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completion_date DATE DEFAULT CURRENT_DATE,
        UNIQUE(user_id, milestone_id)
      );
    `);
    console.log('✅ Created user_milestone_completions table');

    // User Career Progress History
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_career_progress_history (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        career_path_id INTEGER NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
        progress_date DATE NOT NULL DEFAULT CURRENT_DATE,
        total_milestones INTEGER NOT NULL DEFAULT 0,
        completed_milestones INTEGER NOT NULL DEFAULT 0,
        progress_percentage DECIMAL(5,2) DEFAULT 0.00,
        daily_study_minutes INTEGER DEFAULT 0,
        cumulative_study_hours DECIMAL(8,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, career_path_id, progress_date)
      );
    `);
    console.log('✅ Created user_career_progress_history table');

    // Coding Platform History
    await client.query(`
      CREATE TABLE IF NOT EXISTS coding_platform_history (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        record_date DATE NOT NULL DEFAULT CURRENT_DATE,
        leetcode_total_solved INTEGER DEFAULT 0,
        leetcode_easy_solved INTEGER DEFAULT 0,
        leetcode_medium_solved INTEGER DEFAULT 0,
        leetcode_hard_solved INTEGER DEFAULT 0,
        codechef_total_solved INTEGER DEFAULT 0,
        codechef_contest_problems INTEGER DEFAULT 0,
        codechef_rating INTEGER DEFAULT 0,
        codeforces_total_solved INTEGER DEFAULT 0,
        codeforces_contest_solved INTEGER DEFAULT 0,
        codeforces_rating INTEGER DEFAULT 0,
        daily_leetcode_solved INTEGER DEFAULT 0,
        daily_codechef_solved INTEGER DEFAULT 0,
        daily_codeforces_solved INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, record_date)
      );
    `);
    console.log('✅ Created coding_platform_history table');

    // User Daily Streaks Detailed
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_daily_streaks_detailed (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        streak_date DATE NOT NULL DEFAULT CURRENT_DATE,
        leetcode_streak INTEGER DEFAULT 0,
        codechef_streak INTEGER DEFAULT 0,
        codeforces_streak INTEGER DEFAULT 0,
        career_milestone_streak INTEGER DEFAULT 0,
        coding_platforms_streak INTEGER DEFAULT 0,
        overall_learning_streak INTEGER DEFAULT 0,
        had_leetcode_activity BOOLEAN DEFAULT FALSE,
        had_codechef_activity BOOLEAN DEFAULT FALSE,
        had_codeforces_activity BOOLEAN DEFAULT FALSE,
        had_career_activity BOOLEAN DEFAULT FALSE,
        had_any_activity BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, streak_date)
      );
    `);
    console.log('✅ Created user_daily_streaks_detailed table');

    console.log('🎉 All missing tracking tables created successfully');

  } catch (error) {
    console.error('❌ Error creating tracking tables:', error);
  } finally {
    client.release();
    pool.end();
  }
}

createMissingTrackingTables();
