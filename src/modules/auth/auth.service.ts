import bcrypt from 'bcryptjs'
import pool from '../../config/db';

const signUp = async (payload: Record<string, unknown>) => {

    const { name, email, password, phone, role } = payload;

    const normalizedEmail = (email as string).toLowerCase();

    if (typeof password !== 'string' || password.length < 8) {
        throw new Error("Password must be at least 8 characters")
    }

    const hashedPass = await bcrypt.hash(password as string, 10)

    const result = await pool.query(`
        INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *
        `, [name, normalizedEmail, hashedPass, phone, role]);

    return result.rows[0];
}


export const authServices = {
    signUp
}