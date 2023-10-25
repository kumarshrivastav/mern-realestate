import express from "express"
import userController from "../controller/user.controller.js"
import { verifyUser } from "../utils/verifyUser.js"
const router=express.Router()
// router.get("/test",userController.test)
router.post("/update/:id",verifyUser,userController.update)

export default router;