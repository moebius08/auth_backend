import { z } from "zod"

export const emailValidation = z.string().email().min(5).max(255)
const passValidation = z.string().min(8).max(255)
const userAgentValidation = z.string().optional()

export const loginSchema = z.object({
    email: emailValidation, 
    password: passValidation,
    userAgent: userAgentValidation,
 })


export const registerSchema = loginSchema.extend({
    confirmPassword: z.string().min(8).max(255),
}).refine((data) => {
    return data.password === data.confirmPassword;
}, { message: "Passwords don't match",
    path: ["confirmPassword"],
 });

 export const verificationCodeSchema = z.string().min(1).max(24);

 export const resetPasswordSchema = z.object({
   password: passValidation,
   verificationCode: verificationCodeSchema,
 });