import { z } from "zod";

// --- Auth Validators ---
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(72, "Password must be less than 72 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

// --- Address Validator ---
export const addressSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(30, "Label must be less than 30 characters"),
  flat_house_building: z
    .string()
    .min(1, "Flat / House / Building is required")
    .max(150, "Must be less than 150 characters"),
  area_street_sector: z
    .string()
    .min(1, "Area / Street / Sector is required")
    .max(150, "Must be less than 150 characters"),
  landmark: z.string().max(100, "Landmark must be less than 100 characters").optional(),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  city: z
    .string()
    .min(1, "Town / City is required")
    .max(50, "City must be less than 50 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(50, "State must be less than 50 characters"),
  is_default: z.boolean().default(false),
});

// --- Checkout Validator ---
export const checkoutSchema = z.object({
  label: z.string().min(1, "Address label is required"),
  flat_house_building: z
    .string()
    .min(1, "Flat / House / Building is required")
    .max(150, "Must be less than 150 characters"),
  area_street_sector: z
    .string()
    .min(1, "Area / Street / Sector is required")
    .max(150, "Must be less than 150 characters"),
  landmark: z.string().max(100, "Landmark must be less than 100 characters").optional(),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  city: z
    .string()
    .min(1, "Town / City is required")
    .max(50, "City must be less than 50 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(50, "State must be less than 50 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

// --- Profile Validator ---
export const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number")
    .optional()
    .or(z.literal("")),
});

// --- Product Validator (Admin) ---
export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters"),
  price: z
    .number()
    .min(1, "Price must be at least ₹1")
    .max(10000, "Price must be less than ₹10,000"),
  category_id: z.string().min(1, "Category is required"),
  spice_level: z.number().min(1).max(5),
  ingredients: z
    .array(z.string())
    .min(1, "At least one ingredient is required"),
  is_available: z.boolean().default(true),
  is_bestseller: z.boolean().default(false),
});

// --- Review Validator ---
export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z
    .string()
    .min(1, "Review is required")
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters"),
});

// --- Contact Form Validator ---
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  subject: z.string().min(1, "Subject is required").max(100),
  message: z
    .string()
    .min(1, "Message is required")
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

// --- Settings Validator (Admin) ---
export const settingsSchema = z.object({
  restaurant_name: z.string().min(1, "Restaurant name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  delivery_fee: z.number().min(0),
  free_delivery_threshold: z.number().min(0),
  business_hours: z.string().min(1, "Business hours are required"),
});

// Type exports
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
