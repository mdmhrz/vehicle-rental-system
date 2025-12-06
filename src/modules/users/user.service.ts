import pool from "../../config/db";

// get all users
const getUser = async () => {
    const result = await pool.query(`SELECT * FROM users`)
    return result.rows;
}

// update User
const updateUser = async (payload: Record<string, unknown>, id: string) => {
    const { name, email, phone, role } = payload;
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE Id=$5 RETURNING *`, [name, email, phone, role, id])
    return result;
}



// delete user
const deleteUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
    return result
}




export const userServices = {
    getUser, deleteUser, updateUser
}