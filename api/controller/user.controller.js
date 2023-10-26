import User from "../models/user.model.js";
import ErrorHandler from "../utils/error.handler.js";
import bcryptjs from "bcryptjs";
class UserController {
  test(req, res) {
    return res.send({ message: "Hello World" });
  }
  async update(req, res, next) {
    // console.log(req.body);
    // console.log(req.userId);
    // console.log(req.params.id);
    try {
      if (req.userId !== req.params.id) {
        throw next(ErrorHandler(401, "you can only unpdate your profile"));
      }
      const salt = await bcryptjs.genSalt(10);
      if (req.body?.password) {
        req.body.password = await bcryptjs.hash(req.body.password, salt);
      }

      //   console.log(req.body)
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
      //   console.log(updateUser);
      // const { password, ...rest } = updateUser._doc;
      return res.status(201).send(updateUser);
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
      return res.status(200).send({message:"User has been deleted!"});
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
