import { Server as SocketIOServer, Socket } from "socket.io";
import * as chatService from "../services/chat";

export const socketHandler = (io: SocketIOServer) => {
    io.on("connection", (socket: Socket) => {
        console.log(`${socket.id} connected`);

        socket.on("join room", (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);

            socket.to(roomId).emit("user joined", socket.id);
        });

        socket.on("chat message", async (data) => {
            const { userId, roomId, message } = data;

            if (!userId) {
                socket.emit("error", { message: "User ID is required to send messages." });
                return;
            }

            try {
                const savedMessage = await chatService.sendMessage(userId, roomId, message);

                io.to(roomId).emit("chat message", savedMessage);
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
        });
    });
};
