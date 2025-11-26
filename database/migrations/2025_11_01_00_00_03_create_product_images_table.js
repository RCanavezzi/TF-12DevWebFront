import db from '../../config/db.js';

async function up() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS product_images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        relative_path VARCHAR(155),
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.product_images TO aluno;

    GRANT USAGE, SELECT, UPDATE ON SEQUENCE product_images_id_seq TO aluno;
  `);
}

async function down() {
  await db.query(`DROP TABLE IF EXISTS product_images;`);
}

export default { up, down };
