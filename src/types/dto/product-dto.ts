import { CategoryDTO } from "./category-dto";

export interface ProductDTO {
    id?: number;
    name: string;
    desc: string;
    stock: number;
    price: number;
    categoryId: number;
    category: CategoryDTO;
    productImages?: ProductImages[];
}

export interface ProductImages {
    url: string;
}

export interface ProductByCategoryDTO {
    categoryName: string;
    productName: string;
}