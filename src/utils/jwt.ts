import jwt from "jsonwebtoken"
import { jwtRefreshSecretKey } from "../constants/env"

export const signToken = (session_id: string) => {
    return jwt.sign({
        sessionId: session_id
    },jwtRefreshSecretKey,
    {
        audience: ["user"],
        expiresIn: "30d"
    }
)
}