import { Router } from "express";
import authController from "../controllers/auth/authController";
import auth from "../middleware/auth";
const router: Router = Router();

router.post("/login", authController.getKakaoUser);
export default router;
