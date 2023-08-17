import { Request, Response, NextFunction } from "express";
import { Product } from "../models";
import { AppError } from "../utils/error";
import { asyncHandler } from "../utils/asyncHandler";
import mime from "mime-types";
import { Upload } from "../utils/upload";

const product = new Product();

export const addProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productName, specification, imageUrl, imagePath } = req.body;

    if (!productName) {
      return next(new AppError("Product name is required", 400));
    }

    const newProduct = await product.create({
      productName,
      specification,
      imageUrl,
      imagePath,
    });

    res.status(201).json({ success: true, data: newProduct });
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;

    const foundProduct = await product.findById(productId);

    if (!foundProduct) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({ success: true, data: foundProduct });
  }
);

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await product.findMany();

    res.status(200).json({ success: true, data: products });
  }
);

export const updateProductImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);

    const file = req.file;
    const productId = req.params.productId;
    if (!productId) return next(new AppError("No productId is provided", 400));
    if (file == undefined) {
      return next(new AppError("Please provide a room image", 400));
    }

    const mimeType = mime.lookup(file.originalname);
    const isImage = mimeType && mimeType.startsWith("image");
    if (!isImage) {
      return next(new AppError("Please provide file of image type", 400));
    }

    const imagePath = `products/${Date.now()}_${file.originalname}`;
    const upload = await new Upload(imagePath, next).add(file);
    const url = upload.url;

    const updateImage = await product.updateImage(productId, url, imagePath);

    res.status(200).json({
      status: "success",
      message: "Image uploaded successfully",
      data: updateImage,
    });
  }
);
