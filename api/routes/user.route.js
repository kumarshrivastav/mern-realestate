import express from "express"
import userController from "../controller/user.controller.js"
import { verifyUser } from "../utils/verifyUser.js"
const router=express.Router()
router.post("/update/:id",verifyUser,userController.update)
router.delete("/delete/:id",verifyUser,userController.delete)
router.get("/listings/:id",verifyUser,userController.getUserListings)
router.get("/:id",verifyUser,userController.getUser)

export default router;