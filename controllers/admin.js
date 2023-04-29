import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Comment from "../model/Comments.js";
import Enquiry from "../model/enquiry.js";
import Appointment from "../model/appointments.js";
import Admin from "../model/admin.js";
import Blog from "../model/blog.js";
import asyncHandler from "express-async-handler";
import ContactUs from "../model/contactUs.js";
import Cat from "../model/category.js";
import nodemailer from "nodemailer";

class adminController {
  static adminSingup = asyncHandler(async (req, res) => {
    try {
      const pimage = req.files["pimage"][0].filename;
      const admin = new Admin({ ...req.body, pimage });
      const user = await admin.save();
      if (user) {
        res.send({ status: "success", message: "adminSingup succesfully" });
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      return res.json({ error });
    }
  });
  static changePassword = asyncHandler(async (req, res) => {
    try {
      const { oldpass, newpass, confirmpass } = req.body;
      if (!oldpass || !newpass) {
        return res.status(400).json({ error: "pls filled data" });
      }
      if (confirmpass !== newpass) {
        return res.status(400).json({ error: "password not matching" });
      } else {
        const userLogin = await Admin.findOne({ _id: req.user._id });
        if (userLogin) {
          const isMatch = await bcrypt.compare(oldpass, userLogin.password);
          const salt = await bcrypt.genSalt(12);
          const newHashPassword = await bcrypt.hash(req.body.newpass, salt);
          if (isMatch) {
            await Admin.findOneAndUpdate(
              { _id: req.user._id },
              { $set: { password: newHashPassword } }
            );
            res.status(201).send({
              status: "success",
              message: "password changed succefully ",
            });
          } else {
            res
              .status(201)
              .send({ message: "password is worng", status: "failed" });
          }
        }
      }
    } catch (error) {
      res.send(error);
    }
  });

  static adminLogin = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "pls filled data" });
      }
      const userLogin = await Admin.findOne({ email });
      if (userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password);
        const token = jwt.sign(
          { userID: userLogin._id },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        if (!isMatch) {
          res.status(400).send({ message: "work password" });
        } else {
          res.send({
            status: "success",
            message: "Login Success",
            token: token,
          });
        }
      } else {
        res.status(400).send({ message: "filled invalid data" });
      }
    } catch (error) {
      res.send(error);
    }
  });
  static addCategory = asyncHandler(async (req, res) => {
    try {
      const comment = new Cat(req.body);
      const comments = await comment.save();
      if (comments) {
        res.send({ status: "success", message: "Category added succesfully" });
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      res.json({ error });
    }
  });
  static addComment = asyncHandler(async (req, res) => {
    try {
      const comment = new Comment(req.body);
      const comments = await comment.save();
      if (comments) {
        res.send({ status: "success", message: "comment added succesfully" });
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      res.json({ error });
    }
  });
  static addContactUs = asyncHandler(async (req, res) => {
    try {
      const contact = new ContactUs(req.body);
      const Contact = await contact.save();
      if (Contact) {
        res.send({ status: "success", message: "ContactUs added succesfully" });
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      res.json({ error });
    }
  });
  static addEnquiry = asyncHandler(async (req, res) => {
    try {
      const enquiry = new Enquiry(req.body);
      const enquiries = await enquiry.save();
      if (enquiries) {
        res.send({ status: "success", message: "Enqiury added succesfully" });
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      res.json({ error });
    }
  });
  static addAppointment = asyncHandler(async (req, res) => {
    try {
      const { email, date, fname } = req.body;
      const doc = req.files["doc"][0].filename;
      let lol = { ...req.body, doc };
      const appointment = new Appointment(lol);
      const appointments = await appointment.save();

      async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.USER_EMAIL, // generated ethereal user
            pass: process.env.USER_PASSWORD, // generated ethereal password
          },
        });

        // send mail with defined transport object

        let info = await transporter.sendMail({
          from: process.env.USER_EMAIL, // sender address
          to: email, // list of receivers
          subject: `hello Mr.${fname},thanks for chooseing checkmate ✔`, // Subject line
          text: "The checkmate", // plain text body
          html: `<b> shedule appointment </b>: ${new Date(
            date
          ).toDateString()}`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }

      main().catch(console.error);

      if (appointments) {
        res.send({
          status: "success",
          message: "appointment added succesfully",
        });
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      res.json("120");
    }
  });
  static addBlog = asyncHandler(async (req, res) => {
    try {
      let keyTakeWays = JSON.parse(req.body.keyTakeWays);
      const mainTitleImg = req.files["mainTitleImg"][0].filename;
      const title1img = req.files["title1img"][0].filename;
      const title2img = req.files["title2img"][0].filename;
      const title3img = req.files["title3img"][0].filename;
      const title4img = req.files["title4img"][0].filename;
      const title5img = req.files["title5img"][0].filename;

      const lol = {
        ...req.body,
        keyTakeWays,
        title1img,
        title2img,
        title3img,
        title5img,
        title4img,
        mainTitleImg,
      };

      const blog = new Blog(lol);
      const blogs = await blog.save();
      if (blogs) {
        res.send({ status: "success", message: "Blog added succesfully" });
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      res.json(error);
    }
  });
  static getAllAppointment = asyncHandler(async (req, res) => {
    try {
      const responce = await Appointment.find();
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getCategory = asyncHandler(async (req, res) => {
    try {
      const responce = await Cat.find();
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getAllEnquiry = asyncHandler(async (req, res) => {
    try {
      const responce = await Enquiry.find();
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static adminProfile = asyncHandler(async (req, res) => {
    try {
      const responce = await Admin.findById(req.user._id);
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getPopulerBlog = asyncHandler(async (req, res) => {
    try {
      const responce = await Blog.find().sort({ readBy: -1 });
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getBlogById = asyncHandler(async (req, res) => {
    try {
      const responce = await Blog.findById(req.params._id);
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getBlogByCat = asyncHandler(async (req, res) => {
    try {
      const responce = await Blog.find({ category: req.params.category });
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getRecentBlog = asyncHandler(async (req, res) => {
    try {
      const responce = await Blog.find().sort({ createdAt: -1 });
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getAllContactUs = asyncHandler(async (req, res) => {
    try {
      const responce = await ContactUs.find();
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getAllBlog = asyncHandler(async (req, res) => {
    try {
      const responce = await Blog.find();
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getEnquiryById = asyncHandler(async (req, res) => {
    try {
      const responce = await Enquiry.findById(req.params._id);
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getCommentById = asyncHandler(async (req, res) => {
    try {
      const responce = await Comment.find({
        blogId: req.params._id,
      });
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getCommentByBlogId = asyncHandler(async (req, res) => {
    try {
      const responce = await Comment.findById(req.params._id);
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getAppointmentById = asyncHandler(async (req, res) => {
    try {
      const responce = await Appointment.findById(req.params._id);
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static deleteCommentById = asyncHandler(async (req, res) => {
    try {
      const responce = await Comment.findByIdAndDelete(req.params._id);
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
  static getAllComment = asyncHandler(async (req, res) => {
    try {
      const responce = await Comment.find();
      res.send(responce);
    } catch (error) {
      res.send({ error });
    }
  });
}

export default adminController;
