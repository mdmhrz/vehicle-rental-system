import { Request, Response } from "express";
import pool from "../../config/db";
import { authServices } from "./auth.service";

// signUp User
const signUp = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signUp(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    } catch (error: any) {
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: "User registration failed",
                error: "This email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "User registration failed",
            error: error.message
        });
    }
};



// signIn user
const signIn = async (req: Request, res: Response) => {

}






export const authControllers = {
    signUp, signIn
}