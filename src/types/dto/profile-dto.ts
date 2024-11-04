import { Gender } from "@prisma/client";


export interface ProfileDTO {
    name: string;
}

export interface ProfileUpdateDTO {
    id: number;
    name?: string;
    gender?: Gender;
    phone?: string;
    address?: string;
    avatar: string | null;
}
