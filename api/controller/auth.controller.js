import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import ErrorHandler from "../utils/error.handler.js";
class AuthController {
  async signup(req, res, next) {
    try {
      // console.log(req.body)
      const { username, email, password } = req.body;
      let user = await User.find().or([
        { username: username },
        { email: email },
      ]);
      // console.log(user);
      if (user[0]) {
        throw new Error("this email or username has been already taken");
      }
      user = new User({ username, email, password });
      const salt = await bcryptjs.genSalt(10);
      const hashPwd = await bcryptjs.hash(password, salt);
      user.password = hashPwd;
      await user.save();
      const {password:pass,...rest}=user._doc
      return res.status(201).send({ message: "User Registered Successfully",user: rest});
    } catch (error) {
      next(ErrorHandler(501, error.message));
    }
  }
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(ErrorHandler(404, "User Not Found!"));
      }
      const isValidPwd = await bcryptjs.compare(password, user.password);
      if (!isValidPwd) {
        return next(ErrorHandler(401, "Wrong Credentials"));
      }
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: 1000 * 60 * 60 }
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      const {password:pass,...rest}=user._doc
      return res.send({
        message: "User Login Successfully",
        user:rest,
      });
    } catch (error) {
      next(error);
    }
  }
  async signout(req,res,next){
    try {
      res.clearCookie('accessToken')
      res.status(200).send({message:"User Sign Out Successfully"})
    } catch (error) {
      next(ErrorHandler(401,'Signout Failed'))
    }
  }
  async google(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const accessToken = jwt.sign(
          { id: user._id },
          process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: "1d" }
        );
        res
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
          })
          .status(200)
          .send(
            _.pick(user, ["username", "email", , "avatar", "_id", "createdAt"])
          );
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const salt = await bcryptjs.genSalt(10);
        const hashedPwd = await bcryptjs.hash(generatedPassword, salt);
        const newUser = new User({
          username:
            req.body.username.toString().split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPwd,
          avatar: req.body.photo,
        });
        const newUserDoc = await newUser.save();
        const {password,...rest}=newUserDoc._doc
        const accessToken = jwt.sign(
          { id: newUserDoc._id },
          process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: "1d" }
        );
        res
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
          })
          .status(201)
          .send(rest)
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
