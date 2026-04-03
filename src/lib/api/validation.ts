import { z } from "zod";

export const citySlugSchema = z.string().min(1).max(100);

export const mortuarySlugSchema = z.string().min(1).max(255);

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Password must contain at least 1 number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const mortuaryOnboardingSchema = z.object({
  name: z.string().min(1, "Mortuary name is required").max(255),
  address: z.string().min(1, "Address is required"),
  city_id: z.string().uuid("Please select a city"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+27|0)\d{9}$/,
      "Please enter a valid South African phone number"
    ),
  whatsapp: z
    .string()
    .regex(
      /^(\+27|0)\d{9}$/,
      "Please enter a valid South African phone number"
    )
    .optional()
    .or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  description: z.string().max(1000).optional().or(z.literal("")),
  services: z.array(z.string()).min(1, "Select at least one service"),
  price_range: z.enum(["budget", "mid-range", "premium"]).optional(),
});

export const availabilityUpdateSchema = z.object({
  availability: z.enum(["available", "limited", "full"]),
});
