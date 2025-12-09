import { Request, Response } from "express";
import { bookingService } from "./booking.service";


// create a booking
const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.createBooking(req.body)

        // console.log(result.rows[0]);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error
        })
    }
}


// get all bookings
const getBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.getBooking()
        const isEmpty = result.rowCount === 0;

        res.status(200).json({
            success: true,
            message: isEmpty ? "No bookings found" : "Bookings retrieved successfully",
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error
        })
    }
}





// update a booking
const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;
    const user = req.user;

    const result = await bookingService.updateBooking(bookingId, status, user);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};





export const bookingControllers = {
    createBooking, getBookings, updateBooking
}