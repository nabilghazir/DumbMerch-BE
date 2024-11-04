import * as productRepositories from "../repositories/product-repo"
import { ProductDTO } from "../types/dto/product-dto"

export const getAllProduct = async () => {
    return productRepositories.getAllProduct()
}

export const getProduct = async (id: number) => {
    return productRepositories.getProduct(id)
}

export const getProductByCategoryAndName = async (categoryName: string, productName: string) => {
    return productRepositories.findProductByCategoryAndName({ categoryName, productName })
}

export const getProductByCategory = async (categoryId: number) => {
    return productRepositories.getProductByCategory(categoryId)
}

export const createProduct = async (product: ProductDTO) => {
    return productRepositories.createProduct(product)
}

export const findProductByName = async (productName: string) => {
    return productRepositories.findProductByName(productName)
}

export const updateProduct = async (id: number, product: ProductDTO) => {
    return productRepositories.updateProduct(id, product)
}

export const deleteProduct = async (id: number) => {
    return productRepositories.deleteProduct(id)
}