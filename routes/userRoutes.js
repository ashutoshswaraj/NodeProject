const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

router.post("/forgotpassword", authController.forgetPassword);
router.patch("/resetpassword/:token", authController.resetPassword);
router.patch(
  "/updatepassword",
  authController.protect,
  authController.updatePassword
);
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.post(
  "/imageUpload",
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto
);
router.patch(
  "/updateMe",

  authController.protect,

  userController.updateMe
);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
