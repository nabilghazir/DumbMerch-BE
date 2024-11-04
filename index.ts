import express, { Express, json, Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors"
import router from "./src/routes";



dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

app.use((req: Request, res: Response) => {
    res.status(500).json({
        message: res.locals.errorMessage,
    });
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});