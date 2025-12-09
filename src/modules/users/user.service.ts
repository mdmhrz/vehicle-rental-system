import pool from "../../config/db";
import { isAuthorized } from "../../middleware/auth";

// get all users
const getUser = async () => {
    const result = await pool.query(`SELECT * FROM users`)
    return result.rows;
}

// update User
const updateUser = async (payload: Record<string, unknown>, id: string, user: any) => {
    const keys = Object.keys(payload);

    // check is the user authentic
    // console.log(id, user.userId, "isSame");
    // if (user.role !== "admin" && id != user.userId) {
    //     throw new Error("You are not allowed to update this profile");
    // }
    isAuthorized(user, id)


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
    // check nay booking exist by this user!
    const bookingCheck = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [id]);
    const bookingStatus = bookingCheck.rows[0].status;

    console.log(bookingStatus);
    if (bookingStatus === "active") {
        throw new Error("Failed to delete. This user have an active booking")
    }


    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
    return result
}




export const userServices = {
    getUser, deleteUser, updateUser
}