import express from "express";
import cors from "cors";
import { AuthRouter } from "@Routes/Auth.router";
// import { UserRouter } from "@Routes/User.router";
// import { ProductRouter } from "@Routes/Product.router";
import { APP_PORT, APP_HOST } from "@Configs/constants";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRouter);
// app.use("/api/users", UserRouter);
// app.use("/api/products", ProductRouter);

const port = APP_PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello Welcome to SIOMA");
})
    // Health check
    .get('/health', (req, res) => {
        res.json({ status: 'I\'m fine..! Thanks for asking.' });
    })
    .get('/api', (req, res) => {
        res.json({ status: 'Welcome to SIOMA API' });
    });
app.listen(`${APP_HOST}:${port}`, () => {
    console.log(`Listening on host ${APP_HOST}; port ${port}...`);
});