import { HTTP_STATUS } from "../constants/http";
import { createAccount, loginAccount } from "../services/auth.service";
import catchErrors from "../utils/catchErrors";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { setAuthCookies } from "../utils/cookies";
import { verifyToken, AccessTokenPayload } from "../utils/jwt";

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
    }).status(HTTP_STATUS.OK).json({
        message: "Login Succesful"
    })
    })

export const LogoutHandler = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const { payload } = await verifyToken<AccessTokenPayload>(accessToken);
})