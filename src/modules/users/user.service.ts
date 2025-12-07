import pool from "../../config/db";

// get all users
const getUser = async () => {
    const result = await pool.query(`SELECT * FROM users`)
    return result.rows;
}

// update User
const updateUser = async (payload: Record<string, unknown>, id: string) => {
    const keys = Object.keys(payload);

    if (keys.length === 0) {
        throw new Error("No fields provided to update");
    }

    const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");

    const values = keys.map(key => payload[key]);

    const query = `
        UPDATE users
        SET ${setClause}
        WHERE id = $${keys.length + 1}
        RETURNING *;
    `;

    const result = await pool.query(query, [...values, id]);
    return result;
};




// delete user
const deleteUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
    return result
}




export const userServices = {
    getUser, deleteUser, updateUser
}