import pool from '../config/database.js';

async function fixUserGoals() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking if user_goals table exists...');
    
    const listTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log('📑 Existing tables:', listTables.rows.map(r => r.table_name).join(', '));

    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_goals'
      );
    `);
    
    const exists = checkTable.rows[0].exists;
    console.log(`📋 user_goals table exists: ${exists}`);
    
    if (!exists) {
      console.log('🛠️ Creating user_goals table...');
      await client.query(`
        CREATE TABLE user_goals (
          user_id INTEGER PRIMARY KEY,
          monthly_coding_goal INTEGER DEFAULT 50,
          daily_study_goal_minutes INTEGER DEFAULT 60
        )
      `);
      console.log('✅ Created user_goals table successfully');
    } else {
      console.log('✅ Table already exists, checking definition...');
      // Optional: Check if columns exist
    }

  } catch (error) {
    console.error('❌ Error fixing user_goals:', error);
  } finally {
    client.release();
    pool.end(); // Close the pool to exit script
  }
}

fixUserGoals();
