import { Router } from "express";
import { HTTP_STATUS } from "../constants/http";
import { registerHandler, LoginHandler, LogoutHandler } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", LoginHandler);
authRoutes.get("/logout", LogoutHandler);


export default authRoutes;