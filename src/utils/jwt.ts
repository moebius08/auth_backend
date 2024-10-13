import { jwtRefreshSecretKey, jwtSecretKey } from "../constants/env"
import { SessionDocument } from "../models/session.model"
import { UserDocument } from "../models/user.model"
import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken"


export type RefreshTokenPayload = {
    sessionId: SessionDocument["_id"];
}

export type AccessTokenPayload = {
    userId: UserDocument["_id"];
    sessionId: SessionDocument["_id"];
}

type SignOptionsWithSecret = SignOptions & {
    secret: string,
}

const defaults: SignOptions = {
    audience: ["user"],
}

const accessTokenSignOptions: SignOptionsWithSecret = {
    expiresIn: "15m",
    secret: jwtSecretKey
}

export const refreshTokenSignOptions: SignOptionsWithSecret = {
    expiresIn: "30d",
    secret: jwtRefreshSecretKey
}

export const signToken = (
    payload: AccessTokenPayload | RefreshTokenPayload,
    options?: SignOptionsWithSecret
) => {
    const { secret, ...signOpts } = options || accessTokenSignOptions
    return jwt.sign(
        payload,secret,{
            ...defaults,
            ...signOpts
        }
    )
}


export const verifyToken = <TPayload extends object = AccessTokenPayload>(
    token: string,
    options?: VerifyOptions & {
      secret?: string;
    }
  ) => {
    const { secret = jwtSecretKey, ...verifyOpts } = options || {};
    try {
      const payload = jwt.verify(token, secret, {
        ...defaults,
        ...verifyOpts,
      }) as TPayload;
      return {
        payload,
      };
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  };