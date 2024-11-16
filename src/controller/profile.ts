import { NextFunction, Request, Response } from 'express'
import { ProfileUpdateDTO } from '../types/dto/profile-dto';
import * as profileService from '../services/profile'
import uploader from '../libs/cloudinary';


export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fetchingUserId = res.locals.user.id

        const fetchingData = req.body


        if (req.file) {
            fetchingData.avatar = await uploader(req.file as Express.Multer.File);
        }

        const updateProfile = await profileService.UpdateProfile(fetchingUserId, fetchingData)
        res.json(updateProfile)
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fetchingUserId = res.locals.user.id

        const fetchingProfile = await profileService.getProfile(fetchingUserId)

        res.json(fetchingProfile)
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
}