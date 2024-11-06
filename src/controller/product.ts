import { Request, Response } from "express";
import * as productService from "../services/product";
import { ProductDTO, ProductImages } from "../types/dto/product-dto";
import uploader from "../libs/cloudinary";

export const getAllProduct = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProduct();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const fetchProduct = async (req: Request, res: Response) => {
    try {
        const { categoryName, productName } = req.params;
        const product = await productService.getProductByCategoryAndName(categoryName, productName);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const fetchingData = req.params.id;
        const product = await productService.getProduct(Number(fetchingData));
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createProductController = async (req: Request, res: Response) => {
    console.log('Request Body:', req.body);  // Log the request body
    console.log('Request Files:', req.files); // Log the request files
    try {
        const productData: ProductDTO = req.body;

        productData.price = Number(productData.price);
        productData.stock = Number(productData.stock);

        console.log('Product data:', productData);

        const fetchFiles = req.files as Express.Multer.File[];


        console.log("Fetch Files :", fetchFiles);

        if (fetchFiles && fetchFiles.length > 0) {
            const urls: ProductImages[] = await Promise.all(
                fetchFiles.map(async (file) => {
                    const url = await uploader(file);
                    console.log('Uploaded image URL:', url);
                    return { url };
                })
            );
            productData.productImages = urls;
        }

        const newProduct = await productService.createProduct(productData);

        console.log('New product:', newProduct);

        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct,
            images: productData.productImages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
};


export const findProductByName = async (req: Request, res: Response) => {
    try {
        const { productName } = req.params;
        const product = await productService.findProductByName(productName);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const fetchingData: ProductDTO = req.body;

        fetchingData.stock = Number(fetchingData.stock);
        fetchingData.price = Number(fetchingData.price);

        console.log("Fetching data:", fetchingData);



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

        res.json({ message: "Product Updated", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const fetchingId = req.params.id;
        await productService.deleteProduct(Number(fetchingId));
        res.json("Delete Success");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
};


export const testFetchFile = async (req: Request, res: Response) => {
    console.log(req.files);

    const fetchFiles = req.files as Express.Multer.File[];
    res.json(fetchFiles);
};
