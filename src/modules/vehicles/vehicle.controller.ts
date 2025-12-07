import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";


// Create a vehicle entry
const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.createVehicle(req.body);

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// get all vehicles list
const getVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getVehicle();
        const isEmpty = result.rowCount === 0;

        res.status(200).json({
            success: true,
            message: isEmpty ? "No vehicles found" : "Vehicle retrieved successfully",
            data: result.rows
        })

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            error
        })
    }
}

// get single vehicle by id
const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getSingleVehicle(req.params.vehicleId as string)

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error
        })
    }
}

// update vehicle by id
const updateVehicle = async (req: Request, res: Response) => {

};

// delete vehicle by id
const deleteVehicle = async (req: Request, res: Response) => {

}

export const vehicleControllers = {
    createVehicle, getVehicle, getSingleVehicle, updateVehicle, deleteVehicle
}