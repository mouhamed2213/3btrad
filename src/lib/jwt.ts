import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";

// Clé secrète encodée en Uint8Array
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

// Durée de validité
const JWT_EXPIRES_IN = "7d"; // 7 jours

// Interface pour le payload de tes tokens
export interface JwtPayload {
  sub: string; // ID utilisateur
  role: string; // Rôle utilisateur
}

/**
 * Génère un JWT signé
 */
export const generateToken = async (
  userId: string,
  role: string,
  email: string,
): Promise<string> => {
  return await new SignJWT({ role, email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
};

/**
 * Vérifie et décode un JWT
 */
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JwtPayload;
  } catch (error) {
    throw new Error("Token invalide ou expiré");
  }
};
