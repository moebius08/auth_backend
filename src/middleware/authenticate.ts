import { RequestHandler } from "express";
import mongoose from "mongoose";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { HTTP_STATUS } from "../constants/http";
import { verifyToken, AccessTokenPayload } from "../utils/jwt";

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    HTTP_STATUS.UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken<AccessTokenPayload>(accessToken);

  appAssert(
    payload && 'userId' in payload && 'sessionId' in payload,
    HTTP_STATUS.UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = payload!.userId as mongoose.Types.ObjectId;
  req.sessionId = payload!.sessionId as mongoose.Types.ObjectId;
  next();
};

export default authenticate;