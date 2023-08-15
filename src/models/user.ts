import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface UserAttributes {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "customer" | "admin";
  imageUrl?: string;
  imagePath?: string;
  createdAt: Date;
  updatedAt: Date;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
}

class User extends Model<UserAttributes> implements UserAttributes {
  // export class User extends Model<UserAttributes> implements UserAttributes {
  public userId!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public password!: string;
  public role!: "customer" | "admin";
  public imageUrl?: string;
  public imagePath?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public passwordResetToken?: string | null;
  public passwordResetExpires?: Date | null;

  static associate(models: any): void {
    // User.hasMany(models.Booking, {
    //   foreignKey: "userId",
    //   as: "bookings",
    // });
    // User.hasMany(models.Chat, {
    //   foreignKey: "senderId",
    //   as: "chat",
    // });
  }

  async correctPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  createPasswordResetToken(): string {
    console.log("Running create reset token");
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.setDataValue(
      "passwordResetToken",
      crypto.createHash("sha256").update(resetToken).digest("hex")
    );
    this.setDataValue(
      "passwordResetExpires",
      new Date(Date.now() + 20 * 60 * 1000)
    );

    return resetToken;
  }
}

export default (sequelize: Sequelize, DataTypes: any) => {
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("customer", "admin"),
        defaultValue: "customer",
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  // Add hook to hash password before saving
  User.beforeSave(async (user: User) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    }
  });

  return User;
};
