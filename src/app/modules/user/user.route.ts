import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/register", userController.createUser);

router.get("/", auth(), userController.getAllUsers);
router.get("/:id", auth(), userController.getUser);
router.patch("/:userId/role", auth(), userController.updateUserRole);
router.patch("/:userId/activate", auth(), userController.activateUser);
router.patch("/:userId/deactivate", auth(), userController.deactivateUser);
router.delete("/:userId/delete", auth(), userController.deleteUser);

export const userRoute = router;
