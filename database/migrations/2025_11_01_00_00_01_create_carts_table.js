import db from '../../config/db.js';

async function up() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','closed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.carts TO aluno;

    GRANT USAGE, SELECT, UPDATE ON SEQUENCE carts_id_seq TO aluno;
  `);
}

async function down() {
  await db.query(`DROP TABLE IF EXISTS carts;`);
}

export default { up, down };
