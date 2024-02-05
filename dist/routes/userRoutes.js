"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const joiValidation_1 = require("../lib/joiValidation");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const verifyUser = passport_1.default.authenticate("jwt", { session: false });
router.post("/signup", joiValidation_1.userSignUpJOIValidation, index_1.userRegistration);
router.post("/login", joiValidation_1.userLoginJOIValidation, index_1.userLogin);
router.post("/sendPasswordResetEmail", joiValidation_1.sendEmailJOIValidation, index_1.sendUserPasswordResetEmail);
router.post("/resetPassword/:_id/:token", joiValidation_1.resetPasswordJOIValidation, index_1.resetUserPassword);
router.put("/update", joiValidation_1.userUpdateJOIValidation, verifyUser, index_1.userUpdate);
router.get("/profile", verifyUser, index_1.getUserData);
exports.default = router;
