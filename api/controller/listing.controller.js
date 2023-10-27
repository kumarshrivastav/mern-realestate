import ListingModel from "../models/listing.model.js";

class ListingController{
    async create(req,res,next){
try {
    const listing=await ListingModel.create(req.body)
    return res.status(201).send({listing:listing})
} catch (error) {
    next(error)
}
    }
}

export default new ListingController();