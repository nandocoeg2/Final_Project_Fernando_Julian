import Express from "express";
import {
  Login,
  Logout,
  getUserMenu,
  Register,
  actionReportData,
  deleteUser,
  getReportData,
  getReportDataById,
  getReportDataByUserId,
  getUsers,
  reportData,
  updateUser,
  updateRoleMenu,
  getRoleMenu,
} from "../feature/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../feature/RefreshToken.js";

const router = Express.Router();
router.get("/users", verifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.get("/menu", getUserMenu);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id", updateUser);
router.post("/report", reportData);
router.get("/report", getReportData);
router.get("/report/:userId", getReportDataByUserId);
router.get("/detail/:dataId", getReportDataById);
router.patch("/detail/:dataId", actionReportData);
router.post("/menu", updateRoleMenu);
router.get("/allMenu", getRoleMenu);

export default router;
