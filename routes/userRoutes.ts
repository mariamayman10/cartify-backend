import { Router } from "express";
import {
  uploadUserImage,
  changeSignedInUserPassword,
  changeUserPassword,
  createUser,
  deleteUser,
  getSignInUser,
  getUser,
  getUsers,
  resizeUserImage,
  updateSignedInUser,
  updateUser,
  addAddress,
  removeAddress,
  getAddresses,
  getAddress,
} from "../controllers/userController";
import {
  addAddressValidator,
  changePasswordValidator,
  changeSignedInPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  removeAddressValidator,
  updateSignedInUserValidator,
  updateUserValidator,
} from "../utils/validation/userValidator";
import {
  allowedTo,
  applyProtection,
  checkActive,
} from "../controllers/authenticationController";

const UserRoutes: Router = Router();
UserRoutes.use(applyProtection, checkActive);

UserRoutes.get("/me", getSignInUser, getUser);
UserRoutes.put(
  "/updateMe",
  uploadUserImage,
  resizeUserImage,
  updateSignedInUserValidator,
  updateSignedInUser
);
UserRoutes.put(
  "/changeMyPassword",
  changeSignedInPasswordValidator,
  changeSignedInUserPassword
);
UserRoutes.delete("/deleteMe", allowedTo("user"), getSignInUser, deleteUser);
UserRoutes.route("/address")
  .get(allowedTo("user"), getAddresses)
  .post(allowedTo("user"), addAddressValidator, addAddress)
  .delete(allowedTo("user"), removeAddressValidator, removeAddress);
UserRoutes.get("/address/:id", allowedTo("user"), getAddress);

UserRoutes.put(
  "/:userId/changePassword",
  allowedTo("manager"),
  changePasswordValidator,
  changeUserPassword
);
UserRoutes.route("/")
  .get(allowedTo("manager"), getUsers)
  .post(
    allowedTo("manager"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    createUser
  );

UserRoutes.route("/:id")
  .get(allowedTo("manager"), getUserValidator, getUser)
  .delete(allowedTo("manager"), deleteUserValidator, deleteUser)
  .put(
    allowedTo("manager"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    updateUser
  );

export default UserRoutes;
