import ListingModel from "../models/listing.model.js";
import ErrorHandler from "../utils/error.handler.js";

class ListingController {
  async create(req, res, next) {
    try {
      const listing = await ListingModel.create(req.body);
      return res.status(201).send({ listing: listing });
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
        const listing=await ListingModel.findById(req.params.id)
        if(!listing){
            return next(ErrorHandler(404,'Listing Not Found'))
        }
        if(listing.userRef!==req.userId){
            return next(ErrorHandler(401,'You can only delete your own listings'))
        }
        await ListingModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({message:'Listing Deleted Successfully'})
    } catch (error) {
        next(error)
    }
  }
  async update(req,res,next){
    try {
        const listing=await ListingModel.findById(req.params.id)
        if(!listing){
            return next(ErrorHandler(404,'Listing Not Found'))
        }
        if(req.userId!==listing.userRef){
            return next(ErrorHandler(401,'You can only update your own listing'))
        }
        const updatedListing=await ListingModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        return res.status(200).send({message:"Listing Updated Successfully",updatedListing})
    } catch (error) {
        next(error)
    }
  }
  async getListing(req,res,next){
    try {
      const listing=await ListingModel.findById(req.params.id)
      if(!listing){
        return next(ErrorHandler(404,'Listing Not Found'))
      }
      return res.status(200).send(listing)
    } catch (error) {
      next(error)
    }
  }
}

export default new ListingController();
