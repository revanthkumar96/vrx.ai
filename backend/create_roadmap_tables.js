import pool from './config/database.js';

async function createRoadmapTables() {
  let client;
  
  try {
    console.log('🔧 Creating roadmap database tables...');
    
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Create roadmaps table
    await client.query(`
      CREATE TABLE IF NOT EXISTS roadmaps (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty_level VARCHAR(50),
        estimated_duration VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create roadmap_modules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS roadmap_modules (
        id SERIAL PRIMARY KEY,
        roadmap_id INTEGER NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create user_roadmap_progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_roadmap_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        roadmap_id INTEGER NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
        module_id INTEGER NOT NULL REFERENCES roadmap_modules(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, roadmap_id, module_id)
      );
    `);
    
    // Create user_selected_roadmaps table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_selected_roadmaps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        roadmap_id INTEGER NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
        selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, roadmap_id)
      );
    `);
    
    // Create mental_health_conversations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mental_health_conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Roadmap and mental health database tables created successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

createRoadmapTables();
