import { CategoryEntities } from "./category-entities";


export interface ProductEntities {
    id: number;
    name: string;
    price: number;
    description: string;
    avatar: string;
    category: CategoryEntities;
}