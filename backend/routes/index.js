import Express from "express";
import { Login, Logout, Register, getUsers } from "../feature/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../feature/RefreshToken.js";

const router = Express.Router();
router.get("/users", verifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
