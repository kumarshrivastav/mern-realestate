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
      const listing = await ListingModel.findById(req.params.id);
      if (!listing) {
        return next(ErrorHandler(404, "Listing Not Found"));
      }
      if (listing.userRef !== req.userId) {
        return next(ErrorHandler(401, "You can only delete your own listings"));
      }
      await ListingModel.findByIdAndDelete(req.params.id);
      return res.status(200).send({ message: "Listing Deleted Successfully" });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const listing = await ListingModel.findById(req.params.id);
      if (!listing) {
        return next(ErrorHandler(404, "Listing Not Found"));
      }
      if (req.userId !== listing.userRef) {
        return next(ErrorHandler(401, "You can only update your own listing"));
      }
      const updatedListing = await ListingModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res
        .status(200)
        .send({ message: "Listing Updated Successfully", updatedListing });
    } catch (error) {
      next(error);
    }
  }
  async getListing(req, res, next) {
    try {
      const listing = await ListingModel.findById(req.params.id);
      if (!listing) {
        return next(ErrorHandler(404, "Listing Not Found"));
      }
      return res.status(200).send(listing);
    } catch (error) {
      next(error);
    }
  }
  async getListings(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      var offer = req.query.offer;
      if (offer === "false" || offer === undefined) {
        offer = { $in: [true, false] };
      }
      var furnished = req.query.furnished;
      if (furnished === undefined || furnished === "false") {
        furnished = { $in: [false, true] };
      }
      var parking = req.query.parking;
      if (parking === undefined || parking === "false") {
        parking = { $in: [true, false] };
      }
      var type = req.query.type;
      if (type === undefined || type === "all") {
        type = { $in: ["sale", "rent"] };
      }
      const searchTerm = req.query.searchTerm || "";
      const sort = req.query.sort || "createdAt";
      const order = req.query.order || "desc";
      const listings = await ListingModel.find({
        name: { $regex: searchTerm, $options: "i" },
        offer,
        parking,
        furnished,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
      return res.status(200).send(listings);
    } catch (error) {
      next(error);
    }
  }
}

export default new ListingController();
