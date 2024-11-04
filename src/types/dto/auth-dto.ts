import { ProfileDTO } from "./profile-dto";

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
    profile: ProfileDTO;
}
