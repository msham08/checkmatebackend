import express from "express";
import adminController from "../controllers/admin.js";
import upload from "../middileware/upload.js";
import middile from "../middileware/require.js";
const router = express.Router();

//// Middileware//////
const { authenticate } = middile;
router.use("/adminSingup", upload.fields([{ name: "pimage", maxcount: 1 }]));
router.use("/addAppointment", upload.fields([{ name: "doc", maxcount: 1 }]));
router.use(
  "/addBlog",
  upload.fields([
    { name: "title1img", maxcount: 1 },
    { name: "mainTitleImg", maxcount: 1 },
    { name: "title2img", maxcount: 1 },
    { name: "title3img", maxcount: 1 },
    { name: "title4img", maxcount: 1 },
    { name: "title5img", maxcount: 1 },
  ])
);
/// Post request///////
router.post("/adminLogin", adminController.adminLogin);
router.post("/adminSingup", adminController.adminSingup);
router.post("/addBlog", adminController.addBlog);
router.post("/addComment", adminController.addComment);
router.post("/addAppointment", adminController.addAppointment);
router.post("/addEnquiry", adminController.addEnquiry);
router.post("/addContactUs", adminController.addContactUs);
router.post("/addCategory", adminController.addCategory);
router.post("/getBlogById/:_id", adminController.getBlogById);

////// get All request //////
router.get("/getAllEnquiry", authenticate, adminController.getAllEnquiry);
router.get("/getAllComment", adminController.getAllComment);
router.get("/getAllBlog", adminController.getAllBlog);
router.get("/getRecentBlog", adminController.getRecentBlog);
router.get("/getCategory", adminController.getCategory);
router.get("/getBlogByCat", adminController.getBlogByCat);
router.get("/getPopulerBlog", adminController.getPopulerBlog);
router.get("/adminProfile", authenticate, adminController.adminProfile);
router.get("/getAllContactUs", authenticate, adminController.getAllContactUs);
router.get(
  "/getAllAppointment",
  authenticate,
  adminController.getAllAppointment
);
////// get All request By Id //////
router.get(
  "/getAppointmentById/:_id",
  authenticate,
  adminController.getAppointmentById
);
router.get(
  "/getEnquiryById/:_id",
  authenticate,
  adminController.getEnquiryById
);
router.get("/getCommentById/:_id", adminController.getCommentById);
router.get("/getBlogById/:_id", adminController.getBlogById);
router.get("/getBlogByCat/:category", adminController.getBlogByCat);
/// delete requests ////

router.delete("/deleteCommentById/:_id", adminController.deleteCommentById);
/// patch // request //
router.patch("/changePassword", authenticate, adminController.changePassword);

export default router;
