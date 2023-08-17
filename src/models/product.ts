import { PrismaClient } from "@prisma/client";

export interface ProductAttributes {
  productId?: string;
  productName: string;
  specification?: string | null;
  imageUrl?: string | null;
  imagePath?: string | null;
}

export default class Product {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(product: ProductAttributes) {
    return await this.prisma.product.create({
      data: product,
    });
  }

  async findMany() {
    return await this.prisma.product.findMany({});
  }

  async findById(productId: string) {
    return await this.prisma.product.findFirst({
      where: {
        productId: { equals: productId },
      },
    });
  }

  async update(productId: string, updates: ProductAttributes) {
    return await this.prisma.product.update({
      where: {
        productId: productId,
      },
      data: updates,
    });
  }

  async delete(productId: string) {
    return await this.prisma.product.delete({
      where: {
        productId: productId,
      },
    });
  }
}
