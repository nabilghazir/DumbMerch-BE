import * as chatRepo from '../repositories/chat-repo';

export const getOrCreateRoom = async (userId: number) => {
    try {
        console.log('Service: Finding or creating chat room...');
        return await chatRepo.getOrCreateRoom(userId);
    } catch (error) {
        console.error('Error in getOrCreateRoom service:', error);
        throw error;
    }
};

export const sendMessage = async (userId: number, roomId: number, message: string) => {
    try {
        console.log('Service: Sending message...');
        return await chatRepo.sendMessage(userId, roomId, message);
    } catch (error) {
        console.error('Error in sendMessage service:', error);
        throw error;
    }
};

export const getMessages = async (roomId: number) => {
    try {
        console.log('Service: Retrieving messages...');
        return await chatRepo.getMessages(roomId);
    } catch (error) {
        console.error('Error in getMessages service:', error);
        throw error;
    }
};
