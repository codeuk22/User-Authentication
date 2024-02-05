"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPassword = exports.sendUserPasswordResetEmail = exports.getUserData = exports.userUpdate = exports.userLogin = exports.userRegistration = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../../models/index");
const index_2 = require("../../config/index");
exports.userRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserModel.findOne({ email: req.body.email });
        if (user) {
            return res.status(300).send({
                message: "User Already Exist",
                status: false
            });
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(300).send({
                message: "Password and confirmPassword are Not Matched",
                status: false
            });
        }
        const genSalt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
        const hashPassword = yield bcrypt_1.default.hash(req.body.password, genSalt);
        const newUser = new index_1.UserModel(Object.assign(Object.assign({}, req.body), { password: hashPassword }));
        const save = yield newUser.save();
        if (save) {
            return res.status(200).send({
                message: "User Registered",
                status: true,
                user: save
            });
        }
    }
    catch (error) {
        console.log("error in userRegistration", error);
    }
});
exports.userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(300).send({
                message: "User Not Found",
                status: false
            });
        }
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(300).send({
                message: "Invalid Credentials",
                status: false
            });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, version: user.version }, process.env.JWT_KEY, { expiresIn: "1d" });
        return res.status(200).send({
            message: "User Logged In",
            status: true,
            token: token
        });
    }
    catch (error) {
        console.log("error in userLogin", error);
    }
});
exports.userUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserModel.findById(req.user._id);
        if (req.body.newPassword) {
            const compare = yield bcrypt_1.default.compare(req.body.password, user === null || user === void 0 ? void 0 : user.password);
            if (compare) {
                const genSalt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
                const hashPassword = yield bcrypt_1.default.hash(req.body.newPassword, genSalt);
                const updateUser = yield index_1.UserModel.findByIdAndUpdate({ _id: user === null || user === void 0 ? void 0 : user._id }, { $set: Object.assign(Object.assign({}, req.body), { password: hashPassword }) }, { new: true });
                return res.status(301).send({
                    message: "Password Updated",
                    status: true,
                    user: updateUser
                });
            }
            return res.status(401).send({
                message: "Old Password Not Matched",
                status: false
            });
        }
        const updateUser = yield index_1.UserModel.findByIdAndUpdate({ _id: user === null || user === void 0 ? void 0 : user._id }, { $set: req.body }, { new: true });
        return res.status(301).send({
            message: "User Updated",
            status: true,
            user: updateUser
        });
    }
    catch (error) {
        console.log("error in changeUserPassword catch", error);
    }
});
exports.getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserModel.findById(req.user._id);
        return res.status(200).send({
            message: "User Data Successfully Fetched",
            status: true,
            user: user
        });
    }
    catch (error) {
        console.log("error in getUserData catch", error);
    }
});
exports.sendUserPasswordResetEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({
                message: "Email Not Found",
                status: false
            });
        }
        const resetToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "10m" });
        const resetLink = `http://localhost:3000/api/user/reset/${user._id}/${resetToken}`;
        let info = yield index_2.transporter.sendMail({
            from: `"Rohit Kumar " <${process.env.EMAIL_FROM}>`,
            to: [user.email],
            subject: "Password Reset",
            html: `<a href="${resetLink}">Click Here</a> to Reset Your Password`
        });
        return res.status(200).send({
            message: "Password Reset Email Sent. Please Check Your Email.",
            status: true,
            link: resetLink,
            info: info
        });
    }
    catch (error) {
        console.log("error in sendUserPasswordResetEmail catch", error);
    }
});
exports.resetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, confirmPassword } = req.body;
        const { _id, token } = req.params;
        if (password !== confirmPassword) {
            return res.status(401).send({
                message: "Password and confirmPassword are Not Matched",
                status: false
            });
        }
        const user = yield index_1.UserModel.findById(_id);
        try {
            const verify = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        }
        catch (error) {
            return res.status(401).send({
                message: error.message === "jwt expired" ? "Token is Expired" : "Invalid Token",
                error: error,
                status: false
            });
        }
        const genSalt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
        const hashPassword = yield bcrypt_1.default.hash(password, genSalt);
        const updateUser = yield index_1.UserModel.findByIdAndUpdate({ _id: user === null || user === void 0 ? void 0 : user._id }, { $set: { password: hashPassword }, $inc: { version: 1 } }, { new: true });
        if (updateUser) {
            return res.status(200).send({
                message: "Password Reset Successfully",
                status: true,
                user: updateUser
            });
        }
    }
    catch (error) {
        console.log("error in resetUserPassword catch", error);
    }
});
