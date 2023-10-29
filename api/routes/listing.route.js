import express from "express";
import listingController from "../controller/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router=express.Router()
router.post("/create",verifyUser,listingController.create)
router.delete("/delete/:id",verifyUser,listingController.delete)

export default router;