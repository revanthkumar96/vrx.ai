import pool from '../config/database.js';

async function fixCodingStatsColumns() {
  const client = await pool.connect();
  
  try {
    console.log('🛠️ Adding missing columns to coding_stats...');

    // Add codeforces_contest_solved
    await client.query(`
      ALTER TABLE coding_stats 
      ADD COLUMN IF NOT EXISTS codeforces_contest_solved INTEGER DEFAULT 0;
    `);
    console.log('✅ Added codeforces_contest_solved');

    // Add codechef_contests_participated
    await client.query(`
      ALTER TABLE coding_stats 
      ADD COLUMN IF NOT EXISTS codechef_contests_participated INTEGER DEFAULT 0;
    `);
    console.log('✅ Added codechef_contests_participated');

    // Add current_streak
    await client.query(`
      ALTER TABLE coding_stats 
      ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
    `);
    console.log('✅ Added current_streak');
    
    console.log('🎉 coding_stats table successfully updated');

  } catch (error) {
    console.error('❌ Error updating coding_stats columns:', error);
  } finally {
    client.release();
    pool.end();
  }
}

fixCodingStatsColumns();
