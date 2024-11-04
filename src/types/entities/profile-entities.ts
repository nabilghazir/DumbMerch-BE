import { UserEntities } from "./user-entities"

export interface ProfileEntities {
    id: number
    name: string
    gender: string
    phone: number
    address: string
    avatar: string
    user: UserEntities
}