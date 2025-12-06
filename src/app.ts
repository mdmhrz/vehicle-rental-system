import express, { Request, Response } from "express"
import { initDB } from "./config/db";
const app = express();


// init DB
initDB()

// Parser
app.use(express.json());


// Root route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})


// All routes



// not found routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
})


export default app;
