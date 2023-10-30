import express from "express";
import listingController from "../controller/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router=express.Router()
router.post("/create",verifyUser,listingController.create)
router.delete("/delete/:id",verifyUser,listingController.delete)
router.post("/update/:id",verifyUser,listingController.update)
router.get("/get/:id",listingController.getListing)
router.get("/get",listingController.getListings)

export default router;