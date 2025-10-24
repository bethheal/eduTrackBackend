import { Router } from "express";
import {
  adminRegister,
  login,
  updateProfile,
  profileUpload,
  getProfile,
} from "../controller/authController.js";
import { fileUpload } from "../config/fileUpload.js";
import { routeProtect } from "../middleware/routeProtect.js";

const router = Router();

router.post("/adminRegister", adminRegister),
  router.post("/login", login),
  router.post("/profile/update", updateProfile),
  router.post(
    "/upload",
    routeProtect,
    fileUpload.single("avatar"),
    profileUpload
  );
router.get("/profile", routeProtect, getProfile);

export default router;
