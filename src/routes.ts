import { Router } from "express";
import { LoginController } from "./controllers/LoginController";
import { UserController } from "./controllers/UserController";
import { verifyAuth } from "./midlleware/verifyAuth";

export const router = Router();

const userController = new UserController();
const loginController = new LoginController();

router.post("/user", userController.createUser.bind(userController));
router.get(
  "/user/:userId",
  verifyAuth,
  userController.getUserById.bind(userController)
);
router.post("/login", loginController.login.bind(loginController));
router.delete("/user/:userId",verifyAuth, userController.deleteUser.bind(userController));
