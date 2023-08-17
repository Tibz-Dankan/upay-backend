import { Model, DataTypes, Optional } from "sequelize";
import { Sequelize } from "sequelize/types";

interface ProductAttributes {
  productIndex: number;
  productId: string;
  productName: string;
  specification?: string | null;
  imageUrl?: string | null;
  imagePath?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

// Optional attributes for creating a new product
// interface ProductCreationAttributes
//   extends Optional<ProductAttributes, "productIndex" | "updatedAt"> {}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public productIndex!: number;
  public productId!: string;
  public productName!: string;
  public specification!: string | null;
  public imageUrl!: string | null;
  public imagePath!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date | null;

  static associate(models: any): void {
    // Define associations if needed
  }
}

export default (sequelize: Sequelize, DataTypes: any) => {
  Product.init(
    {
      productIndex: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      productId: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      productName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      specification: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imagePath: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "_products",
      timestamps: true,
      underscored: true,
    }
  );

  return Product;
};
