import assert from "node:assert"
import { HttpStatusCode } from "../constants/http"
import AppErrorCode from "../constants/appErrorCode"
import AppError from "./AppError"

/**
 * Asserts a condition and throws an AppError if the condition is falsy
 */

type AppAssert = (
    conditon: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode
) => asserts conditon;

const appAssert:AppAssert = (condition, httpStatusCode, message, appErrorCode) => assert(condition, new AppError(httpStatusCode,message,appErrorCode)); 

export default appAssert