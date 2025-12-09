import express, { Request, Response } from "express"
import { initDB } from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import path from "path"
const app = express();



// init DB
initDB()

// Parser
app.use(express.json());
// Serve static files from public folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send(path.join(__dirname, "..", "public", "index.html"))
})


// auth routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes)



// not found routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
})


export default app;
