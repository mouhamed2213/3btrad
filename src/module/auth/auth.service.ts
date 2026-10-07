import { logger } from "../../config/logger.js";
import { Prisma } from "../../database/prisma/generate/prisma/client.js";

export const AuthService = {
  async registerUser(user: Prisma.UserCreateInput) {
    const createdUser = await prisma?.user.create({ data: { ...user } });
    logger.info(`User created with email: ${createdUser?.email}`);
    return createdUser;
  },

  async findUserByEmail(email: string) {
    const user = await prisma?.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn(`User not found with email: ${email}`);
      return null;
    }
    return user;
  },
};
