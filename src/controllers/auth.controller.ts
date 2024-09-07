import { HTTP_STATUS } from "../constants/http";
import catchErrors from "../utils/catchErrors";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email().min(5).max(255),
    password: z.string().min(8).max(255),
    confirmPassword: z.string().min(8).max(255),
    userAgent: z.string().optional(),
}).refine((data) => {
    return data.password === data.confirmPassword;
}, { message: "Passwords don't match",
    path: ["confirmPassword"],
 });


export const registerHandler = catchErrors(async (req, res) => {

    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent']});
        
        // const user = await User.create({
        //     email: request.email,
        //     password: request.password,
        // }); 

        res.status(HTTP_STATUS.OK).json({
            success: true,
            server_response: 'Registered successfully',
        }); 

});