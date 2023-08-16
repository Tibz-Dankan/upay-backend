import { Request, Response, NextFunction } from "express";
import { models } from "../models";
import { AppError } from "../utils/error";
import { asyncHandler } from "../utils/asyncHandler";

const Product = models.Product;

export const addProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productName, specification, imageUrl, imagePath } = req.body;

    if (!productName) {
      return next(new AppError("Product name is required", 400));
    }
    const newProduct = Product.build(req.body);
    await newProduct.save();

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    const product = await Product.findOne({ where: { productId } });

    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.findAll();

    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  }
);
