import { jwtRefreshSecretKey, jwtSecretKey } from "../constants/env";
import VerificationCodeType from "../constants/verificateCodetypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken"

export type CreateAccountParams = {
    email: string,
    password: string,
    userAgent?: string
}

export const createAccount = async (data:CreateAccountParams) => {
    //verify existing user
    const existingUser = await UserModel.exists({
        email: data.email
    })
    if (existingUser) {
        throw new Error("User Already Exists")
    }
    //create user
    const user = await UserModel.create(data)

    //create verification code
    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    })
    //send verification email

    //create session

    const session = await SessionModel.create({
        userId: user._id,
        userAgent: data.userAgent,
    })

    //sign access & refresh token

    const refreshToken = jwt.sign(
        { sessionId: session._id},
        jwtRefreshSecretKey,{
            audience: ['user'],
            expiresIn: "30d"
        }   
    )
    const accessToken = jwt.sign(
        { userId: user._id,
        sessionId: session._id},
        jwtSecretKey,{
            audience: ['user'],
            expiresIn: "30d"
        }   
    )
    return {
        user,
        refreshToken,
        accessToken
    }


    //return user & tokens

}