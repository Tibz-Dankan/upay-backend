import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;
export interface UserAttributes {
  userId: string;
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

import { randomBytes, createHash } from "crypto";

import { PrismaClient } from "@prisma/client";

export default class User {
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: UserAttributes) {
    user.password = await hash(`${user.password}`, 10);

    return await this.prisma.user.create({
      data: user,
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        imageUrl: true,
      },
    });
  }

  async findMany() {
    return await this.prisma.user.findMany({});
  }

  async findById(userId: String) {
    return await this.prisma.user.findFirst({
      where: {
        userId: { equals: userId },
      },
    });
  }

  async findByEmail(email: String) {
    return await this.prisma.user.findFirst({
      where: {
        email: { equals: email },
      },
    });
  }

  async update(id: Number, name: String, email: String) {
    return await this.prisma.user.update({
      where: {
        id: { equals: id },
      },
      data: {
        name: name,
        email: email,
      },
    });
  }

  async updatePassword(userId: Number, newPassword: String) {
    const newHashedPassword = await hash(`${newPassword}`, 10);
    return await this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        password: newHashedPassword,
      },
    });
  }

  async comparePasswords(currentPassword: String, savedPassword: String) {
    return await compare(`${currentPassword}`, `${savedPassword}`);
  }

  createPasswordResetToken() {
    const resetToken = randomBytes(32).toString("hex");
    return resetToken;
  }

  async savePasswordResetToken(userId: Number, resetToken: String) {
    const hashedToken = createHash("sha256")
      .update(`${resetToken}`)
      .digest("hex");

    return await this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 1000 * 60 * 20),
      },
    });
  }

  async updatePasswordResetToken(user: UserAttributes) {
    return await this.prisma.user.update({
      where: {
        userId: user.userId,
      },
      data: {
        passwordResetToken: user.passwordResetToken,
        passwordResetExpires: user.passwordResetExpires,
      },
    });
  }

  async passwordResetExpired(expiryDate: String) {
    return new Date(`${expiryDate}`) < new Date(Date.now());
  }
}
