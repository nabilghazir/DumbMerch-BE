export interface CreateCartDTO {
    userId: number;
}

export interface AddProductToCartDTO {
    userId: number;
    productId: number;
    quantity: number;
}

export interface UpdateProductQuantityDTO {
    id: number;
    productId: number;
    quantity: number;
}

export interface CartItemDTO {
    productId: number;
    name: string;
    stock: number;
    price: number;
    image: string;
    quantity: number;
}

export interface CartDetailsDTO {
    id: number;
    userId: number;
    items: CartItemDTO[];
    totalPrice: number;
}
