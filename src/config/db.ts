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
            )`
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type TEXT,
            registration_number TEXT NOT NULL UNIQUE,
            daily_rent_price INT NOT NULL
                CHECK (daily_rent_price >= 0),
            availability_status VARCHAR(50) NOT NULL
                CHECK (availability_status IN ('available', 'booked'))
            )`
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date TIMESTAMP NOT NULL,
            rent_end_date TIMESTAMP NOT NULL
                CHECK (rent_end_date >= rent_start_date),
            total_price INT NOT NULL
                CHECK (total_price >= 0),
            status VARCHAR(20) NOT NULL
                CHECK (status IN ('active', 'cancelled', 'returned'))
            )
            `)

        console.log("Tables created successfully");
    } catch (error) {
        console.log("Table creation failed", error);
    }

}


export default pool;

