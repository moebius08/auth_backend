import { APP_ORIGIN } from "../constants/env";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { HTTP_STATUS } from "../constants/http";
import { signToken, refreshTokenSignOptions } from "../utils/jwt";
import { verifyToken, RefreshTokenPayload } from "../utils/jwt";
import { fiveMinutesAgo, ONE_DAY_MS, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import VerificationCodeModel from "../models/verificationCode.model";
import VerificationCodeType from "../constants/verificateCodetypes";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplate";
import { hashValue } from "../utils/bcrypt";
import { sendMail } from "../utils/sendMail";

export type CreateAccountParams = {
    email: string,
    password: string,
    userAgent?: string
}

export const createAccount = async (data:CreateAccountParams) => {
    const existingUser = await UserModel.exists({
        email: data.email
    })
    appAssert(!existingUser, HTTP_STATUS.CONFLICT, "User Already Exists");

    const user = await UserModel.create({
      email: data.email,
      password: data.password,
    });
  
    const userId = user._id
    const verificationCode = await VerificationCodeModel.create({
      userId,
      type: VerificationCodeType.EmailVerification,
      expiresAt: oneYearFromNow(),
    });

    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

    // send verification email
    const { error } = await sendMail({
      to: user.email,
      ...getVerifyEmailTemplate(url),
    });
    // ignore email errors for now
    if (error) console.error(error);

    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent,
    })

    const refreshToken = signToken({ sessionId: session._id},refreshTokenSignOptions)
    const accessToken = signToken({ userId,sessionId: session._id})

    return {
        user: user.omitPassword(),
        refreshToken,
        accessToken
    }
}

export type LoginAccountParams = {
    email: string,
    password: string,
    userAgent?: string

}

export const loginAccount = async ({email,userAgent,password}:LoginAccountParams) => {
    const user = await UserModel.findOne({email})

    appAssert(user, HTTP_STATUS.NOT_FOUND, "Invalid Email or Password")

    const isValid = await user.comparePassword(password)

    appAssert(isValid, HTTP_STATUS.FORBIDDEN, "Invalid Email or Password")

    const session = await SessionModel.create({
        userId: user._id,
        userAgent: userAgent,
    })

    const sessionInfo = {
        sessionId: session._id
    }

    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)
    const accessToken = signToken({
        ...sessionInfo,
        userId: user._id
    })

    return {
        user: user.omitPassword(),
        refreshToken,
        accessToken
    }

}

export const refreshUserAccessToken = async (refreshToken: string) => {
    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });
    appAssert(payload, HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
  
    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();
    appAssert(
      session && session.expiresAt.getTime() > now,
      HTTP_STATUS.UNAUTHORIZED,
      "Session expired"
    );
  
    // refresh the session if it expires in the next 24hrs
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
    if (sessionNeedsRefresh) {
      session.expiresAt = thirtyDaysFromNow();
      await session.save();
    }
  
    const newRefreshToken = sessionNeedsRefresh
      ? signToken(
          {
            sessionId: session._id,
          },
          refreshTokenSignOptions
        )
      : undefined;
  
    const accessToken = signToken({
      userId: session.userId,
      sessionId: session._id,
    });
  
    return {
      accessToken,
      newRefreshToken,
    };
  };
  
  export const verifyEmail = async (code: string) => {
    const validCode = await VerificationCodeModel.findOne({
      _id: code,
      type: VerificationCodeType.EmailVerification,
      expiresAt: { $gt: new Date() },
    });
    appAssert(validCode, HTTP_STATUS.NOT_FOUND, "Invalid or expired verification code");
  
    const updatedUser = await UserModel.findByIdAndUpdate(
      validCode.userId,
      {
        verified: true,
      },
      { new: true }
    );
    appAssert(updatedUser, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to verify email");
  
    await validCode.deleteOne();
  
    return {
      user: updatedUser.omitPassword(),
    };
  };
    
  export const sendPasswordResetEmail = async (email: string) => {
    // Catch any errors that were thrown and log them (but always return a success)
    // This will prevent leaking sensitive data back to the client (e.g. user not found, email not sent).
    try {
      const user = await UserModel.findOne({ email });
      appAssert(user, HTTP_STATUS.NOT_FOUND, "User not found");
  
      // check for max password reset requests (2 emails in 5min)
      const fiveMinAgo = fiveMinutesAgo();
      const count = await VerificationCodeModel.countDocuments({
        userId: user._id,
        type: VerificationCodeType.PasswordReset,
        createdAt: { $gt: fiveMinAgo },
      });
      appAssert(
        count <= 1,
        HTTP_STATUS.TOO_MANY_REQUESTS,
        "Too many requests, please try again later"
      );
  
      const expiresAt = oneHourFromNow();
      const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationCodeType.PasswordReset,
        expiresAt,
      });
  
      const url = `${APP_ORIGIN}/password/reset?code=${
        verificationCode._id
      }&exp=${expiresAt.getTime()}`;
  
      const { data, error } = await sendMail({
        to: email,
        ...getPasswordResetTemplate(url),
      });
  
      appAssert(
        data?.id,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        `${error?.name} - ${error?.message}`
      );
      return {
        url,
        emailId: data.id,
      };
    } catch (error: any) {
      console.log("SendPasswordResetError:", error.message);
      return {};
    }
  };
  
  type ResetPasswordParams = {
    password: string;
    verificationCode: string;
  };
  
  export const resetPassword = async ({
    verificationCode,
    password,
  }: ResetPasswordParams) => {
    const validCode = await VerificationCodeModel.findOne({
      _id: verificationCode,
      type: VerificationCodeType.PasswordReset,
      expiresAt: { $gt: new Date() },
    });
    appAssert(validCode, HTTP_STATUS.NOT_FOUND, "Invalid or expired verification code");
  
    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
      password: await hashValue(password),
    });
    appAssert(updatedUser, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to reset password");
  
    await validCode.deleteOne();
  
    // delete all sessions
    await SessionModel.deleteMany({ userId: validCode.userId });
  
    return { user: updatedUser.omitPassword() };
  };