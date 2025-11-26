import db from '../../config/db.js';

async function up() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS line_items (
        id SERIAL PRIMARY KEY,
        cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity INTEGER NOT NULL CHECK (quantity >= 1),
        unit_price_times_thousand INTEGER NOT NULL CHECK (unit_price_times_thousand >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (cart_id, product_id)
    );

    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.line_items TO aluno;

    GRANT USAGE, SELECT, UPDATE ON SEQUENCE line_items_id_seq TO aluno;
  `);
}

async function down() {
  await db.query(`DROP TABLE IF EXISTS line_items;`);
}

export default { up, down };
