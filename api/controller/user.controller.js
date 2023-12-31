import ListingModel from "../models/listing.model.js";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/error.handler.js";
import bcryptjs from "bcryptjs";
class UserController {
  async update(req, res, next) {
    try {
      if (req.userId !== req.params.id) {
        throw next(ErrorHandler(401, "you can only unpdate your profile"));
      }
      const salt = await bcryptjs.genSalt(10);
      if (req.body?.password) {
        req.body.password = await bcryptjs.hash(req.body.password, salt);
      }
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updateUser._doc;
      return res.status(201).send(rest);
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      if (req.params.id !== req.userId) {
        return next(ErrorHandler(401, "you can only delete your account"));
      }
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie("accessToken");
      return res.status(200).send({ message: "User has been deleted!" });
    } catch (error) {
      next(error);
    }
  }
  async getUser(req, res, next) {
    try {
      const user=await User.findById(req.params.id)
      if(!user){
        return next(ErrorHandler(404,'User Not Found'))
      }
      const {password:pass,...rest}=user._doc
      return res.status(200).send(rest)
    } catch (error) {
      next(error)
    }
  }
  async getUserListings(req, res, next) {
    if (req.userId === req.params.id) {
      try {
        const listing = await ListingModel.find({ userRef: req.params.id });
        return res.status(200).send(listing);
      } catch (error) {
        next(error);
      }
    } else {
      return next(ErrorHandler(401, "you can only see your own listing"));
    }
  }
}

export default new UserController();
