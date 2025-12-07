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
    const { email, password } = req.body

    try {
        const result = await authServices.signIn(email, password)

        if (result) {
            const { password, ...user } = result.user;
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token: result.token,
                    user
                }
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}






export const authControllers = {
    signUp, signIn
}