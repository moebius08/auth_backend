import { HTTP_STATUS } from "../constants/http";
import { createAccount, loginAccount } from "../services/auth.service";
import catchErrors from "../utils/catchErrors";
import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { setAuthCookies } from "../utils/cookies";


export const registerHandler = catchErrors(async (req, res) => {

    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent']});
        
    const {user, accessToken ,refreshToken} = await createAccount(request)

    return setAuthCookies({
        res,accessToken,refreshToken
    }).status(HTTP_STATUS.CREATED).json(user)
});

export const LoginHandler = catchErrors(async (req, res) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent']});

    const {user,accessToken, refreshToken} = await loginAccount(request)

    return setAuthCookies({
        res,accessToken,refreshToken
    }).status(HTTP_STATUS.ACCEPTED).json(user)
    })
