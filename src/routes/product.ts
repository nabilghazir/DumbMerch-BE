import { Router } from "express";
import * as productController from "../controller/product";
import { authorization } from "../middlewares/authorization";
import upload from "../middlewares/upload-file";

const productRouter = Router();

productRouter.get("/getallproduct", productController.getAllProduct);
productRouter.get("/get/:id", productController.getProduct);
productRouter.get("/:categoryName/:productName", productController.fetchProduct);
productRouter.get("/product/getproductbyname/:productName", productController.findProductByName);
productRouter.post("/create", authorization("ADMIN"), upload.array('productImages', 4), productController.createProductController);
productRouter.put("/update/:id", authorization("ADMIN"), upload.array("productImages", 4), productController.updateProduct);
productRouter.delete("/delete/:id", authorization("ADMIN"), productController.deleteProduct);



productRouter.post("/test-files", authorization("ADMIN"), upload.array("productImages", 4), productController.testFetchFile);
productRouter.post('/test-upload', upload.array('productImages', 4), (req, res) => {
    console.log('Uploaded Files:', req.files);
    res.status(200).json({ message: 'Files received', files: req.files });
});

export default productRouter;
