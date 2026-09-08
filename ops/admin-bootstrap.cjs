const crypto = require("node:crypto");
const fs = require("node:fs");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});

async function main() {
  const [rawName, rawEmail, password] = input.trimEnd().split(/\r?\n/);
  const name = rawName?.trim();
  const email = rawEmail?.trim().toLowerCase();

  if (!name || !email || !password || password.length < 14) {
    throw new Error("Name, email and a password of at least 14 characters are required.");
  }

  const caFile = process.env.DATABASE_SSL_CA_FILE;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    ssl: {
      rejectUnauthorized: true,
      ca: caFile ? fs.readFileSync(caFile, "utf8") : undefined,
    },
  });

  try {
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users
        (id, name, email, password_hash, role, preferred_locale)
       VALUES ($1, $2, $3, $4, 'admin', 'pl')
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         role = 'admin',
         preferred_locale = 'pl',
         updated_at = now()
       RETURNING id, email`,
      [id, name, email, passwordHash],
    );

    const adminId = result.rows[0].id;
    await pool.query(
      `INSERT INTO audit_logs
        (id, actor_user_id, action, entity, entity_id, metadata)
       VALUES ($1, $2, 'admin.bootstrap', 'users', $2, $3)`,
      [crypto.randomUUID(), adminId, JSON.stringify({ source: "one-time-bootstrap" })],
    );

    console.log(`Admin bootstrap completed for ${result.rows[0].email}.`);
  } finally {
    await pool.end();
  }
}

process.stdin.on("end", () => {
  main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Admin bootstrap failed.");
  process.exitCode = 1;
  });
});
