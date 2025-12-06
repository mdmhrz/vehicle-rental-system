import { Pool } from 'pg'
import confing from '.'


// Connect DB
const pool = new Pool({
    connectionString: confing.connection_str
})

export const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(254) NOT NULL UNIQUE
                CHECK (email = LOWER(email)),
            password TEXT NOT NULL
                CHECK (LENGTH(password) >= 6),
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(20) NOT NULL
                CHECK (role IN ('admin', 'customer'))
            );
        `);

        console.log("Tables created successfully");
    } catch (error) {
        console.log("Table creation failed", error);
    }

}


export default pool;

