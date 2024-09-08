import { HTTP_STATUS } from "../constants/http";
import { createAccount } from "../services/auth.service";
import catchErrors from "../utils/catchErrors";
import { z } from "zod";
import { setAuthCookies } from "../utils/cookies";

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

        const {user, accessToken ,refreshToken} = await createAccount(request)

        return setAuthCookies({
            res,accessToken,refreshToken
        }).status(HTTP_STATUS.CREATED).json(user)
});