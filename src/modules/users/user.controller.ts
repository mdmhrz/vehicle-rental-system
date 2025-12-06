import { Request, Response } from "express";
import { userServices } from "./user.service";


// get all user
const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser()

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

// update single user
const updateUser = async (req: Request, res: Response) => {

    try {
        const result = await userServices.updateUser(req.body, req.params.userId as string)

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            const { password, ...userWithoutPassword } = result.rows[0];
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: userWithoutPassword
            })
        }
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

// Delete user
const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.userId as string)

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
                error: result.rowCount
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            })
        }
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}


export const userControllers = {
    getUser, updateUser, deleteUser
}