import pool from '../config/database.js';

async function checkUserSchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking users.id column type...');
    
    const result = await client.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'id';
    `);
    
    if (result.rows.length > 0) {
      console.log('📋 users.id type:', JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log('❌ users table or id column not found');
    }

    console.log('🔍 Checking user_profiles.user_id column type...');
    const resultProfiles = await client.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles' AND column_name = 'user_id';
    `);
    
    if (resultProfiles.rows.length > 0) {
      console.log('📋 user_profiles.user_id type:', JSON.stringify(resultProfiles.rows[0], null, 2));
    } else {
      console.log('❌ user_profiles table or user_id column not found');
    }

  } catch (error) {
    console.error('❌ Error checking schema:', error);
  } finally {
    client.release();
    pool.end();
  }
}

checkUserSchema();
