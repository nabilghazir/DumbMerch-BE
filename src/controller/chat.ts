import { Request, Response } from 'express';
import * as chatService from '../services/chat';

export const getOrCreateRoom = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const room = await chatService.getOrCreateRoom(userId);
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error finding or creating chat room', error });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { roomId, message } = req.body;

    try {
        const messageSent = await chatService.sendMessage(userId, roomId, message);
        res.status(201).json(messageSent);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    const { roomId } = req.params;

    try {
        const messages = await chatService.getMessages(Number(roomId));
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};
