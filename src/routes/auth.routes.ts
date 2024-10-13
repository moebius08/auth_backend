import { Router } from "express";
import {
  sendPasswordResetHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  verifyEmailHandler,
  LoginHandler,
  LogoutHandler,
} from "../controllers/auth.controller";

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", LoginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", LogoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;