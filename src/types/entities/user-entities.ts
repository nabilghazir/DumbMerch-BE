import { User } from "@prisma/client";

export type UserEntities = Omit<User, "password">