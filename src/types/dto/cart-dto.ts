export interface CreateCartDTO {
    userId: number;
}

export interface AddProductToCartDTO {
    userId: number;
    productId: number;
    quantity: number;
}

export interface UpdateProductQuantityDTO {
    cartId: number;
    productId: number;
    quantity: number;
}

export interface CartItemDTO {
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface CartDetailsDTO {
    cartId: number;
    userId: number;
    items: CartItemDTO[];
    totalPrice: number;
}
