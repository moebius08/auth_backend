import { HTTP_STATUS } from "../constants/http";
import { createAccount, loginAccount, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyEmail } from "../services/auth.service";
import catchErrors from "../utils/catchErrors";
import { loginSchema, registerSchema, verificationCodeSchema, resetPasswordSchema, emailValidation } from "../schemas/auth.schema";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { verifyToken, AccessTokenPayload } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";
import  { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from "../utils/cookies";

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

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    return clearAuthCookies(res)
        .status(HTTP_STATUS.OK)
        .json({ message: "Logout successful" });
})

export const refreshHandler = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, HTTP_STATUS.UNAUTHORIZED, "Missing refresh token");
  
    const { accessToken, newRefreshToken } = await refreshUserAccessToken(
      refreshToken
    );
    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }
    return res
      .status(HTTP_STATUS.OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({ message: "Access token refreshed" });
  });
  

  export const verifyEmailHandler = catchErrors(async (req, res) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);
  
    await verifyEmail(verificationCode);
  
    return res.status(HTTP_STATUS.OK).json({ message: "Email was successfully verified" });
  });
  
  export const sendPasswordResetHandler = catchErrors(async (req, res) => {
    const email = emailValidation.parse(req.body.email);
  
    await sendPasswordResetEmail(email);
  
    return res.status(HTTP_STATUS.OK).json({ message: "Password reset email sent" });
  });
  
  export const resetPasswordHandler = catchErrors(async (req, res) => {
    const request = resetPasswordSchema.parse(req.body);
  
    await resetPassword(request);
  
    return clearAuthCookies(res)
      .status(HTTP_STATUS.OK)
      .json({ message: "Password was reset successfully" });
  });