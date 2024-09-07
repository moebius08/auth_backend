import { Router } from "express";
import { HTTP_STATUS } from "../constants/http";
import { registerHandler } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);



export default authRoutes;