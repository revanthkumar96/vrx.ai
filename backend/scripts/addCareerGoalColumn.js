import pool from '../config/database.js';

async function addCareerGoalColumn() {
  const client = await pool.connect();
  try {
    console.log('🔄 Adding career_goal column to user_profiles...');
    
    await client.query(`
      ALTER TABLE user_profiles 
      ADD COLUMN IF NOT EXISTS career_goal VARCHAR(255);
    `);
    
    console.log('✅ Added career_goal column successfully.');
  } catch (error) {
    console.error('❌ Error adding column:', error);
  } finally {
    client.release();
    pool.end();
  }
}

addCareerGoalColumn();
