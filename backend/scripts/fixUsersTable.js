import pool from '../config/database.js';

async function fixUsersTable() {
  const client = await pool.connect();
  
  try {
    console.log('🛠️ Checking users table schema...');

    // Add profile_image_url column
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
    `);
    console.log('✅ Added profile_image_url column to users table');

    // Verification
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    
    console.log('📋 Current columns in users table:');
    res.rows.forEach(row => {
      console.log(` - ${row.column_name} (${row.data_type})`);
    });

  } catch (error) {
    console.error('❌ Error updating users table:', error);
  } finally {
    client.release();
    pool.end();
  }
}

fixUsersTable();
