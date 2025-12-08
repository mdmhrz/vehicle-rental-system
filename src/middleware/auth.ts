import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import confing from "../config";
import pool from "../config/db";


const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const headerToken = req.headers.authorization;

            const token = headerToken?.split(' ')[1]
            // console.log("splited token", token);

            if (!token) {
                return res.status(500).json({
                    message: "You're not allowed"
                })
            }


            const decoded = jwt.verify(token, confing.jwt_secret as string) as JwtPayload;
            const userId = (await pool.query(`SELECT * FROM users where email=$1`, [decoded.email])).rows[0].id;
            const userInfo = {
                userId, ...decoded
            }

            // decoded set into request by express custom namespace type declaration
            req.user = userInfo
            console.log(req.user);

            if (roles && roles.length && !roles.includes(decoded.role)) {
                return res.status(500).json({
                    error: "Unauthorized Access"
                })
            }

            next()

            // console.log(decoded);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}


export default auth;