import { Role } from "@prisma/client";
import * as userRepositories from "../repositories/user-repo";
import { LoginDTO, RegisterDTO } from "../types/dto/auth-dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const register = async (RegisterData: RegisterDTO) => {
    const existedUserCheck = await userRepositories.checkUser(RegisterData.email!);
    if (existedUserCheck) {
        throw new Error("User already exists");
    }

    if (!RegisterData.password) {
        throw new Error("Password is required");
    }

    console.log('Password before hashing:', RegisterData.password);


    const hashedPassword = await bcrypt.hash(RegisterData.password, 10);

    const createdUser = userRepositories.createUser({
        ...RegisterData,
        password: hashedPassword
    })

    return createdUser
}

export const login = async (loginData: LoginDTO) => {
    const user = await userRepositories.checkUser(loginData.email!);

    if (!user) {
        throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(loginData.password, user.password);

    if (!isValidPassword) {
        throw new Error("Email / password is incorrect");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET || "fhuiuad!biHAgfbashdbuBDAuhfifahui2139&^$jDU)Jjd*319DS*&@)djsadi",
        {
            expiresIn: "1d"
        }
    )

    return token
}

export const getProfile = async (email: string) => {
    return userRepositories.findUserAndProfile(email)
}

export const getAllUser = async () => {
    return userRepositories.getAllUser()
}
