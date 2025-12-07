import pool from '../config/database.js';

async function recreateUserGoals() {
  const client = await pool.connect();
  
  try {
    console.log('🛠️ Dropping incorrect user_goals table...');
    await client.query('DROP TABLE IF EXISTS user_goals');
    
    console.log('🛠️ Creating user_goals table with UUID...');
    await client.query(`
      CREATE TABLE user_goals (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        monthly_coding_goal INTEGER DEFAULT 50,
        daily_study_goal_minutes INTEGER DEFAULT 60
      )
    `);
    console.log('✅ Recreated user_goals table successfully with UUID support');

  } catch (error) {
    console.error('❌ Error recreating user_goals:', error);
  } finally {
    client.release();
    pool.end();
  }
}

recreateUserGoals();
