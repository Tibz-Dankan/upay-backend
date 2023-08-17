import { Request, Response, NextFunction } from "express";
import { Product } from "../models";
import { AppError } from "../utils/error";
import { asyncHandler } from "../utils/asyncHandler";

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
