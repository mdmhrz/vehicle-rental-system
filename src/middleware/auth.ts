import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import confing from "../config";


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


            // decoded set into request by express custom namespace type declaration
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
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