import db from '../../config/db.js';

async function up() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(155),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NULL,
        photo VARCHAR(255) NULL,
        role VARCHAR(5) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER','ADMIN')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.users TO aluno;

    GRANT USAGE, SELECT, UPDATE ON SEQUENCE users_id_seq TO aluno;
  `);
}

async function down() {
  await db.query(`DROP TABLE users;`);
}

export default { up, down };