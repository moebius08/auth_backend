import { jwtRefreshSecretKey, jwtSecretKey, password } from "../constants/env";
import VerificationCodeType from "../constants/verificateCodetypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken"
import { HTTP_STATUS } from "../constants/http";

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
    appAssert(!existingUser, HTTP_STATUS.CONFLICT, "User Already Exists");

    const user = await UserModel.create(data)

    //create verification code
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
    console.log(user)
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

export const loginAccount = async ({email,userAgent}:LoginAccountParams) => {
    const user = await UserModel.findOne({email})

    appAssert(user, HTTP_STATUS.NOT_FOUND, "Invalid Email or Password")

    const isValid = user.comparePassword(password)

    appAssert(isValid, HTTP_STATUS.FORBIDDEN, "Invalid Email or Password")

    const session = await SessionModel.create({
        userId: user._id,
        userAgent: userAgent,
    })

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
    console.log(user)
    return {
        user: user.omitPassword(),
        refreshToken,
        accessToken
    }

}