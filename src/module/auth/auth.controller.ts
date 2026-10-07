import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../../config/logger.js";
import { BadRequestError } from "../../lib/app-error.js";
import { generateToken } from "../../lib/jwt.js";
import { AuthService } from "./auth.service.js";

export const AuthContrloller = {
  // Create Admin User
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, role, phone, email, password } = req.body;
      const user = {
        firstName,
        lastName,
        role,
        phone,
        email,
        password,
      };

      // Check if the admin user already exists

      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        throw new BadRequestError("Admin user already exists");
      }

      // Create the User
      const hashedPassword = await bcrypt.hash(password, 10);

      const userWithHashedPassword = {
        ...user,
        password: hashedPassword,
      };

      const result = await AuthService.registerUser(userWithHashedPassword);

      logger.info(`Admin user created with email: ${result?.email}`);
    } catch (error) {
      logger.warn("Error creating admin user:", error);
      next(error);
      // return res.status(500).json({ message: "Internal server error" });
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        throw new BadRequestError("Invalid email or password");
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestError("Invalid email or password");
      }

      // Jwt token generation can be added here if needed, for example:
      const token = await generateToken(user.id, user.role, user.email);
      console.log({ user, token });

      // If login is successful, you can generate a token or return user info
      logger.info(`User logged in with email: ${user.email}`);
      return res
        .status(200)
        .json({ status: "ok", message: "Login successful", token });
    } catch (error) {
      logger.warn("Error during login:", error);
      next(error);
    }
  },
};
