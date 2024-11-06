import { CategoryDTO } from "./category-dto";

export interface ProductDTO {
    id?: number;
    name: string;
    desc: string;
    stock: number;
    price: number;
    categoryName: string;
    productImages?: ProductImages[];
}

export interface ProductImages {
    url: string;
}

export interface ProductByCategoryDTO {
    categoryName: string;
    productName: string;
}
