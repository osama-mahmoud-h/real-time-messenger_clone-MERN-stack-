import {App} from "../app";
import express from "express";
import {AuthController} from "../controllers/auth.controller";
import {UserAuthMiddleware} from "../middlewares/UserAuth.middleware";

   const router = express.Router();
        router.post(
            "/login",
            AuthController.login
        );
        router.post(
            "/register",
            AuthController.register
        );
        router.post("/logout", AuthController.logout);
        router.get("/isAuth",
            UserAuthMiddleware.verifyToken,
            AuthController.getUserInfo
        );

 export default router;
