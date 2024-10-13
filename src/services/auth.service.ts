import { password } from "../constants/env";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { HTTP_STATUS } from "../constants/http";
import { signToken, refreshTokenSignOptions } from "../utils/jwt";

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

    const userId = user._id

    //create verification code
    //send verification email

    //create session

    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent,
    })

    //sign access & refresh token

    const refreshToken = signToken({ sessionId: session._id},refreshTokenSignOptions)
    const accessToken = signToken({ userId,sessionId: session._id})
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