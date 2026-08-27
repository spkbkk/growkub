import pg from "pg";
const { Pool } = pg;

const workingUrl = "postgresql://postgres.sqbpmcfaxakinqckoloz:BY9diZ8TBauLeDNL@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres";

async function testFullDb() {
  console.log("Connecting to Supabase ap-southeast-2...");
  const pool = new Pool({
    connectionString: workingUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    // 1. Create tables
    console.log("Creating tables...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_th VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        description_th TEXT NOT NULL,
        description_en TEXT NOT NULL,
        icon VARCHAR(100) DEFAULT 'Globe',
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_th VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        short_description_th TEXT NOT NULL,
        short_description_en TEXT NOT NULL,
        description_th TEXT NOT NULL,
        description_en TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        cover_image VARCHAR(500) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        project_year VARCHAR(50) NOT NULL,
        technologies TEXT[] DEFAULT '{}',
        is_featured BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS project_features (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
        title_th VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        description_th TEXT NOT NULL,
        description_en TEXT NOT NULL,
        sort_order INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS project_images (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        alt_th VARCHAR(255),
        alt_en VARCHAR(255),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        company VARCHAR(255),
        project_type VARCHAR(100) NOT NULL,
        budget VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'NEW',
        internal_note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id VARCHAR(255) PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value_th TEXT NOT NULL,
        value_en TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Tables created successfully!");

    // 2. Insert test admin
    await pool.query(`
      INSERT INTO admins (id, email, password_hash, name, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    `, [
      "admin-1",
      "admin@growkub.com",
      "$2a$10$PyoWQIXUv00i/zdyq6IaBeo4Yq9FFbSmXUBl9j8hxYFemsfy1Dp1a",
      "Growkub SuperAdmin",
      "admin"
    ]);
    console.log("✅ Admin user seeded!");

    // 3. Count
    const countRes = await pool.query("SELECT COUNT(*) FROM admins");
    console.log("Admin count in live database:", countRes.rows[0].count);

  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    await pool.end();
  }
}

testFullDb();
