import { Request, Response } from "express";
import * as productService from "../services/product";
import { ProductDTO, ProductImages } from "../types/dto/product-dto";
import uploader from "../libs/cloudinary";

export const getAllProduct = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProduct()
        res.json(products)
    } catch (error) {
        console.log(error);

        const err = error as Error
        res.status(500).json({
            message: err.message
        })
    }
}

export const fetchProduct = async (req: Request, res: Response) => {
    try {
        const { categoryName, productName } = req.params;
        console.log(productName);

        const product = await productService.getProductByCategoryAndName(categoryName, productName)

        res.json(product)
    } catch (error) {
        console.log(error);

        const err = error as Error
        res.status(500).json({
            message: err.message
        })
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {
        const fetchingData = req.params.id
        const product = await productService.getProduct(Number(fetchingData))

        res.json(product)
    } catch (error) {
        console.log(error);

        const err = error as Error
        res.status(500).json({
            message: err.message
        })
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const fetchingData: ProductDTO = req.body

        fetchingData.stock = Number(fetchingData.stock);
        fetchingData.price = Number(fetchingData.price);
        fetchingData.categoryId = Number(fetchingData.categoryId);

        const fetchFiles = req.files as Express.Multer.File[]

        if (fetchFiles && fetchFiles.length > 0) {
            const urls: ProductImages[] = await Promise.all(
                fetchFiles.map(async (file) => {
                    const url = await uploader(file);
                    return { url };
                })
            );
            fetchingData.productImages = urls;
        } else {
            fetchingData.productImages = [];
        }


        const product = await productService.createProduct(fetchingData)


        res.json({
            message: "Product Created",
            product
        })
    } catch (error) {
        console.log(error);

        const err = error as Error
        res.status(500).json({
            message: err.message
        })
    }
}

export const findProductByName = async (req: Request, res: Response) => {
    try {
        const { productName } = req.params
        console.log(productName);

        const product = await productService.findProductByName(productName)

        res.json(product)
    } catch (error) {
        console.log(error);

        const err = error as Error
        res.status(500).json({
            message: err.message
        })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const fetchingData: ProductDTO = req.body;
        fetchingData.stock = Number(fetchingData.stock);
        fetchingData.price = Number(fetchingData.price);
        fetchingData.categoryId = Number(fetchingData.categoryId);

        const fetchFiles = req.files as Express.Multer.File[];

        if (fetchFiles && fetchFiles.length > 0) {
            const urls: ProductImages[] = await Promise.all(
                fetchFiles.map(async (file) => {
                    const url = await uploader(file);
                    return { url };
                })
            );
            fetchingData.productImages = urls;
        }

        const fetchingId = req.params.id;
        const product = await productService.updateProduct(Number(fetchingId), fetchingData);

        res.json({
            message: "Product Updated",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};


export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const fetchingId = req.params.id
        const product = await productService.deleteProduct(Number(fetchingId))

        res.json("Delete Success")
    } catch (error) {
        console.log(error);

        const err = error as Error
        res.status(500).json({
            message: err.message
        })
    }
}
