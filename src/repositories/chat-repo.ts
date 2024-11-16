import { prisma } from "../libs/prisma";

export const getOrCreateRoom = async (userId: number) => {
    try {

        const admin = await prisma.user.findFirst({
            where: {
                role: "ADMIN",
            },
            select: {
                id: true,
            },
        });

        const chatRoomId = `${userId}${admin?.id}`

        if (!admin) {
            throw new Error("No admin found in the database.");
        }

        const room = await prisma.chatRoom.findFirst({
            where: {
                AND: [
                    { userId: userId },
                    { adminId: admin.id },
                ],
            },
            include: {
                Chat: true,
                user: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            }
                        }
                    }
                },
            },
        });

        if (room) {
            console.log("Chat room found:", room);
            return room;
        }

        console.log("No existing room found, creating a new one...");

        const newRoom = await prisma.chatRoom.create({
            data: {
                userId,
                adminId: admin.id,
            },
            include: {
                user: {
                    include: {
                        profile: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                },
                Chat: true,
            },
        });

        console.log("New chat room created:", newRoom);
        return newRoom;
    } catch (error) {
        console.error("Error in getOrCreateRoom:", error);
        throw error;
    }
};

export const sendMessage = async (userId: number, roomId: number, message: string) => {
    try {
        console.log("Sending message...");

        const res = await prisma.chat.create({
            data: {
                message: message,
                senderId: userId,
                chatRoomId: roomId,
            },
        });

        console.log("Message sent:", res.message);
        return res;
    } catch (error) {
        console.error("Error in sendMessage:", error);
        throw error;
    }
};

export const getMessages = async (chatRoomId: number) => {
    try {
        console.log("Fetching messages for chat room...");

        const messages = await prisma.chat.findMany({
            where: {
                chatRoomId,
            },
            include: {
                sender: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        console.log("Messages retrieved:", messages);
        return messages;
    } catch (error) {
        console.error("Error in getMessages:", error);
        throw error;
    }
};
