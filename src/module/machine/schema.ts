import { z } from "zod";
import {
  MachineryCategory,
  MachineryStatus,
} from "../../database/prisma/generate/prisma/enums.js";

export const createMachinerySchema = z
  .object({
    code: z
      .string({ required_error: "Le code est requis" })
      .min(2, "Le code doit contenir au moins 2 caractères")
      .trim()
      .toUpperCase(), // Transforme "cat-320" en "CAT-320"

    name: z
      .string({ required_error: "Le nom est requis" })
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .trim(),

    brand: z
      .string({ required_error: "La marque est requise" })
      .min(2, "La marque doit contenir au moins 2 caractères")
      .trim(),

    model: z
      .string({ required_error: "Le modèle est requis" })
      .min(1, "Le modèle est requis")
      .trim(),

    category: z.nativeEnum(MachineryCategory, {
      errorMap: () => ({ message: "Catégorie invalide" }),
    }),

    year: z
      .number({ invalid_type_error: "L'année doit être un nombre" })
      .int("L'année doit être un entier")
      .min(1950, "Année invalide")
      .max(new Date().getFullYear() + 1, "Année future non autorisée")
      .optional()
      .nullable(),

    operatingHours: z
      .number({
        invalid_type_error: "Les heures de service doivent être un nombre",
      })
      .nonnegative("Le nombre d'heures ne peut pas être négatif")
      .default(0.0),

    status: z
      .nativeEnum(MachineryStatus, {
        errorMap: () => ({ message: "Statut invalide" }),
      })
      .default(MachineryStatus.AVAILABLE),

    // Tarifs (optionnels et non-négatifs)
    hourlyRate: z
      .number()
      .nonnegative("Le tarif horaire doit être positif")
      .optional()
      .nullable(),
    dailyRate: z
      .number()
      .nonnegative("Le tarif journalier doit être positif")
      .optional()
      .nullable(),
    rotationRate: z
      .number()
      .nonnegative("Le tarif de rotation doit être positif")
      .optional()
      .nullable(),

    // Vente
    isForSale: z.boolean().default(false),
    salePrice: z
      .number()
      .nonnegative("Le prix de vente doit être positif")
      .optional()
      .nullable(),
    saleDetails: z.string().trim().optional().nullable(),
  })
  // Validation conditionnelle : Si 'isForSale' est true, 'salePrice' est recommandé ou obligatoire
  .refine(
    (data) => {
      if (
        data.isForSale &&
        (data.salePrice === undefined || data.salePrice === null)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Un prix de vente est requis lorsque l'engin est destiné à la revente",
      path: ["salePrice"],
    },
  );

// Schéma pour la mise à jour partielle
// export const updateMachinerySchema = createMachinerySchema.partial();

// Inférence des types TypeScript
export type CreateMachineryInput = z.infer<typeof createMachinerySchema>;
// export type UpdateMachineryInput = z.infer<typeof updateMachinerySchema>;
