const enum AppErrorCode {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
    PASSWORD_MISMATCH = "PASSWORD_MISMATCH",
    INVALID_TOKEN = "INVALID_TOKEN",
    EXPIRED_TOKEN = "EXPIRED_TOKEN",
    INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
    REFRESH_TOKEN_EXPIRED = "REFRESH_TOKEN_EXPIRED",
    INVALID_VERIFICATION_CODE = "INVALID_VERIFICATION_CODE",
    VERIFICATION_CODE_EXPIRED = "VERIFICATION_CODE_EXPIRED",
    VERIFICATION_CODE_ALREADY_USED = "VERIFICATION_CODE_ALREADY_USED",
    USER_ALREADY_VERIFIED = "USER_ALREADY_VERIFIED",
    USER_NOT_VERIFIED = "USER_NOT_VERIFIED",
    EMAIL_VERIFICATION_CODE_NOT_FOUND = "EMAIL_VERIFICATION_CODE_NOT_FOUND",
    REFRESH_TOKEN_NOT_FOUND = "REFRESH_TOKEN_NOT_FOUND",
}

export default AppErrorCode