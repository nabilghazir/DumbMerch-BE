import uploader from "../libs/cloudinary";
import * as profileRepositories from "../repositories/profile-repo";
import { ProfileUpdateDTO } from "../types/dto/profile-dto";

export const UpdateProfile = async (id: number, data: ProfileUpdateDTO) => {
    return profileRepositories.updateProfile(id, data);
}

export const getProfile = async (id: number) => {
    return profileRepositories.getProfile(id);
}