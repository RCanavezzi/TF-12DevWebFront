import db from '../../config/db.js';

async function up() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(155),
        price_times_thousand INTEGER NOT NULL CHECK (price_times_thousand >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.products TO aluno;

    GRANT USAGE, SELECT, UPDATE ON SEQUENCE products_id_seq TO aluno;
  `);
}

async function down() {
  await db.query(`DROP TABLE products;`);
}

export default { up, down };