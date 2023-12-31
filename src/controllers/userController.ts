import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import { AppError } from "../utils/error";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthToken } from "../utils/token";
import { Email } from "../utils/email";
import { createHash } from "crypto";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

const user = new User();

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    console.log(req.body);

    if (!firstName || !lastName || !email || !password || !phone) {
      return next(new AppError("Please fill out all fields", 400));
    }
    if (!email.includes("@")) {
      return next(new AppError("Please supply a valid email", 400));
    }

    const usr = await user.findByEmail(email);
    if (usr) return next(new AppError("Email already registered", 400));

    req.body.role = "customer";

    const newUser = await user.create(req.body);

    console.log("newUser");
    console.log(newUser);

    await new AuthToken(newUser, 201, res).send();
  }
);

export const signin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return next(new AppError("Please fill out all fields", 400));
    }
    const savedUser = await user.findByEmail(email);

    if (!savedUser) {
      return next(new AppError("Email is not registered", 400));
    }

    const correctPassword = await user.comparePasswords(
      password,
      savedUser.password
    );

    if (!savedUser || !correctPassword) {
      new AppError("Supplied invalid email or password", 400);
    }

    await new AuthToken(savedUser, 200, res).send();
  }
);

// export const forgotPassword = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const email = req.body.email;

//     if (!email) return next(new AppError("Please fill out all fields", 400));

//     try {
//       const user = await User.findOne({ where: { email: email } });

//       if (!user) {
//         return next(
//           new AppError("There is no user with the supplied email", 404)
//         );
//       }

//       const resetToken = user.createPasswordResetToken();
//       console.log(resetToken);
//       await user.save();

//       const resetURL = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;
//       const subject = "Reset Password";

//       console.log(resetURL);

//       await new Email(email, subject).sendPasswordReset(
//         resetURL,
//         user.firstName
//       );

//       res.status(200).json({
//         status: "success",
//         message: "Password reset token sent to email",
//       });
//     } catch (error) {
//       next(error); // Pass the error to the error handling middleware
//     }
//   }
// );

// export const resetPassword = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.params.token;
//     if (!token) return next(new AppError("Please provide a reset token", 400));
//     const hashedToken = createHash("sha256").update(token).digest("hex");

//     try {
//       const user = await User.findOne({
//         where: {
//           passwordResetToken: hashedToken,
//           passwordResetExpires: { [Op.gt]: new Date() },
//         },
//       });

//       if (!user) {
//         return next(new AppError("Token is invalid or has expired", 400));
//       }

//       const newPassword = req.body.password;
//       if (!newPassword)
//         return next(new AppError("Please supply a password", 400));

//       user.password = req.body.password;
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       await user.save();

//       await new AuthToken(user, 200, res).send();
//     } catch (error) {
//       next(error); // Pass the error to the error handling middleware
//     }
//   }
// );

// export const protect = asyncHandler(
//   async (req: Request | any, res: Response, next: NextFunction) => {
//     const authHeader = req.headers["authorization"];
//     let token;
//     if (authHeader && authHeader.startsWith("Bearer")) {
//       token = authHeader.split(" ")[1];
//     }
//     if (!token) {
//       return next(
//         new AppError("You are not logged! Please to get access", 400)
//       );
//     }

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//     const userId = decoded.userId;

//     const user = await User.findOne({ where: { userId: userId } });
//     if (!user) {
//       return next(
//         new AppError("The user belonging to this token no exists!", 403)
//       );
//     }
//     // req.id = decoded.userId;
//     // next();
//     req["user"] = user;
//     res.locals.user = user;
//     next();
//   }
// );
