import bcrypt from 'bcryptjs'
import pool from '../../config/db';
import jwt from 'jsonwebtoken'
import confing from '../../config';

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


const signIn = async (email: string, password: string) => {
    console.log(email, password);

    // check if email exist or not
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

    // console.log(result);

    if (result.rows.length === 0) {
        throw new Error("User not exist");
    }

    // if email is true
    const user = result.rows[0];
    // check password
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        throw new Error("Invalid Password")
    }


    const token = jwt.sign(
        {
            name: user.name,
            email: user.email,
            role: user.role
        },
        confing.jwt_secret as string,
        {
            expiresIn: '7d'
        }
    )

    return { token, user }
}


export const authServices = {
    signUp, signIn
}