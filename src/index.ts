import express, { Request, Response } from "express";
import cors from "cors";
import { APP_PORT, APP_HOST } from "@Configs/constants";
import "dotenv/config";

import { AuthRouter } from "@Routes/Auth.router";
// import { UserRouter } from "@Routes/User.router";
import { ProductRouter } from "@Routes/Product.router";
import { CategoryRouter } from "@Routes/CategoryRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRouter);
// app.use("/api/users", UserRouter);
app.use("/api/products", ProductRouter);
app.use("/api/categories", CategoryRouter);
const host = APP_HOST || 'localhost';
const port = Number(APP_PORT) || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello Welcome to SIOMA");
})
    // Health check
    .get('/health', (req: Request, res: Response) => {
        res.json({ status: 'I\'m fine..! Thanks for asking.' });
    })
    .get('/api', (req: Request, res: Response) => {
        res.json({ status: 'Welcome to SIOMA API' });
    });
// Start the server
app.listen(port, host, () => {
    console.log(`Listening on host ${host}; port ${port}...`);
});