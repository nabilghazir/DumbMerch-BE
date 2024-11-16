import express, { Express, json, Request, Response, urlencoded, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./src/routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketHandler } from "./src/socket/socket";

dotenv.config();
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

app.use("/api", router);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err.message);
    res.status(500).json({
        message: "An error occurred on the server",
    });
});

socketHandler(io);

server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    console.log(`[socket]: WebSocket is running at ws://localhost:${port}`);
});
