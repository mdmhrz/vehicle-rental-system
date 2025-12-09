import pool from "../../config/db";


// create a vehicle information
const createVehicle = async (payload: Record<string, unknown>) => {

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    if (daily_rent_price as number < 0) {
        throw new Error("Vehicle rent can not be less than 0")
    }

    const vehicleDetails = await pool.query(`SELECT * FROM vehicles WHERE registration_number=$1`, [registration_number]);
    if(vehicleDetails.rowCount !== 0){
        throw new Error("This vehicle is already registered")
    }

    const result = await pool.query(`
        INSERT INTO vehicles(vehicle_name, type, registration_number,daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING * 
        `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

    return result.rows[0]
}

// get all vehicle information by id
const getVehicle = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
}


// get single vehicle information by id
const getSingleVehicle = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id])
    return result
}


// update vehicle information by id
const updateUser = async (payload: Record<string, unknown>, id: string) => {
    const keys = Object.keys(payload);

    if (keys.length === 0) {
        throw new Error("No fields provided for update");
    }

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const values = keys.map(key => payload[key]);

    const query = `
        UPDATE vehicles 
        SET ${setClause} 
        WHERE id = $${keys.length + 1}
        RETURNING *;
    `;

    const result = await pool.query(query, [...values, id]);
    return result;
};


// delete a single vehicle entry
const deleteVehicle = async (id: string) => {
    const result = await pool.query(`
        DELETE FROM vehicles
        WHERE id=$1
        `, [id]);
    return result

}



export const vehicleService = {
    createVehicle,
    getVehicle,
    getSingleVehicle,
    updateUser,
    deleteVehicle
}