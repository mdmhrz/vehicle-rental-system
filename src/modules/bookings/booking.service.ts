import pool from "../../config/db"


// Create Bookings
const createBooking = async (payload: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // 1. Check vehicle
    const vehicleResult = await pool.query(
        `SELECT * FROM vehicles WHERE id = $1`,
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status === "booked") {
        throw new Error("Vehicle is currently not available");
    }

    // 2. Calculate rent days
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const difference = end.getTime() - start.getTime();

    const totalDays = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
        throw new Error("Invalid rent duration");
    }

    // 3. Calculate total price
    const total_price = vehicle.daily_rent_price * totalDays;
    const status = "active";

    // 4. Create booking
    const bookingResult = await pool.query(
        `
      INSERT INTO bookings(
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
        [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price,
            status,
        ]
    );

    // 5. Mark vehicle as booked
    await pool.query(
        `UPDATE vehicles
     SET availability_status = 'booked'
     WHERE id = $1`,
        [vehicle_id]
    );

    const bookingDetails = bookingResult.rows[0];

    // 6. Final response
    return {
        ...bookingDetails,
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price,
        },
    };
};



// get all bookings
const getBooking = async () => {
    const bookingResult = await pool.query(`SELECT * FROM bookings`)
    return bookingResult;
}



// update booking
const updateBooking = async (bookingId: number, status: string, user: any) => {

    // get bookings details from database
    const bookingResult = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [bookingId]
    );

    if (bookingResult.rows.length === 0) {
        throw new Error("Booking not found");
    }

    const booking = bookingResult.rows[0];

    // Role based condition apply

    // CUSTOMER Cancellation
    if (user.role === "customer") {
        console.log(booking.customer_id);
        console.log(user.userId)
        if (booking.customer_id !== user.userId) {
            throw new Error("You are not allowed to cancel this booking");
        }

        if (status !== "cancelled") {
            throw new Error("Customers can only cancel bookings");
        }

        // Update booking status
        const updated = await pool.query(
            `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
            [bookingId]
        );

        return {
            message: "Booking cancelled successfully",
            data: updated.rows[0],
        };
    }

    // ADMIN Mark as returned
    if (user.role === "admin") {
        if (status !== "returned") {
            throw new Error("Admin can only mark booking as returned");
        }

        // Update booking status
        const updated = await pool.query(
            `UPDATE bookings 
       SET status = 'returned' 
       WHERE id = $1 
       RETURNING *`,
            [bookingId]
        );

        // Making vehicle available again
        const vehicleId = booking.vehicle_id;

        await pool.query(
            `UPDATE vehicles 
       SET availability_status = 'available'
       WHERE id = $1`,
            [vehicleId]
        );

        return {
            message: "Booking marked as returned. Vehicle is now available",
            data: {
                ...updated.rows[0],
                vehicle: { availability_status: "available" },
            },
        };
    }

    // If user role is not admin
    throw new Error("Unauthorized role action");
};






export const bookingService = {
    createBooking, getBooking, updateBooking
}