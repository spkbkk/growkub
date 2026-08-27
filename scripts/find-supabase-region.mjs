import pg from "pg";
const { Pool } = pg;

const regions = [
  "ap-southeast-1", // Singapore
  "ap-southeast-2", // Sydney
  "ap-northeast-1", // Tokyo
  "ap-northeast-2", // Seoul
  "ap-south-1",     // Mumbai
  "us-east-1",     // North Virginia
  "us-west-1",     // North California
  "us-west-2",     // Oregon
  "eu-central-1",  // Frankfurt
  "eu-west-1",     // Ireland
  "eu-west-2",     // London
  "eu-west-3",     // Paris
  "sa-east-1",     // Sao Paulo
  "ca-central-1",  // Central Canada
];

const password = "BY9diZ8TBauLeDNL";
const projectRef = "sqbpmcfaxakinqckoloz";

async function findRegion() {
  console.log(`Testing all Supabase regions for project: ${projectRef}...`);

  for (const region of regions) {
    const connStr = `postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    console.log(`Checking ${region}...`);

    const pool = new Pool({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000,
    });

    try {
      const res = await pool.query("SELECT NOW() as current_time, version();");
      console.log(`\n🎉 FOUND WORKING REGION: ${region} 🎉`);
      console.log("WORKING DATABASE_URL:");
      console.log(connStr);
      console.log("DB Time:", res.rows[0].current_time);
      await pool.end();
      return connStr;
    } catch (err) {
      if (!err.message.includes("tenant/user") && !err.message.includes("ENOTFOUND")) {
        console.log(`[${region}] Response:`, err.message);
      }
    } finally {
      await pool.end().catch(() => {});
    }
  }

  // Also test with direct pooler (pooler.supabase.com)
  const generalPooler = `postgresql://postgres.${projectRef}:${password}@pooler.supabase.com:6543/postgres`;
  console.log("Checking general pooler...");
  const pool = new Pool({
    connectionString: generalPooler,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  try {
    const res = await pool.query("SELECT NOW() as current_time;");
    console.log("🎉 FOUND GENERAL POOLER WORKING:", generalPooler);
  } catch (err) {
    console.log("General pooler response:", err.message);
  } finally {
    await pool.end().catch(() => {});
  }
}

findRegion();
