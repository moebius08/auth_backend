import { Router } from "express";
import { HTTP_STATUS } from "../constants/http";
import { registerHandler, LoginHandler } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", LoginHandler);


export default authRoutes;