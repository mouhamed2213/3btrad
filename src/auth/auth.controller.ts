import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../common/app-error.js";
import { logger } from "../config/logger.js";
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
        // return res.status(400).json({ message: "Admin user already exists" });
      }

      // Create the User
      const hashedPassword = await bcrypt.hash(password, 10);

      const userWithHashedPassword = {
        ...user,
        password: hashedPassword,
      };

      const result = await AuthService.registerUser(userWithHashedPassword);

      logger.info(`Admin user created with email: ${result?.email}`);
      // Hash the password
    } catch (error) {
      // ! implement error global handling
      logger.warn("Error creating admin user:", error);
      next(error);
      // return res.status(500).json({ message: "Internal server error" });
    }
  },
};
