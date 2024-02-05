"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordJOIValidation = exports.sendEmailJOIValidation = exports.userUpdateJOIValidation = exports.userLoginJOIValidation = exports.userSignUpJOIValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const userSignUpSchema = joi_1.default.object({
    name: joi_1.default.string().required().trim(),
    email: joi_1.default.string().email().required().trim(),
    password: joi_1.default.string().required(),
    confirmPassword: joi_1.default.string().required(),
    tc: joi_1.default.boolean().required()
});
const userLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().trim(),
    password: joi_1.default.string().required()
});
const userUpdateSchema = joi_1.default.object({
    name: joi_1.default.string().optional().trim(),
    email: joi_1.default.string().email().optional().trim(),
    password: joi_1.default.string().optional(),
    newPassword: joi_1.default.string().optional()
});
const sendEmailSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().trim()
});
const resetPasswordSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
    confirmPassword: joi_1.default.string().required()
});
exports.userSignUpJOIValidation = (req, res, next) => {
    try {
        const { error, value } = userSignUpSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                success: false,
                error: error.details[0].message.split('\"').join(''),
                message: "JOI in userSignUpValidation block"
            });
        }
        next();
    }
    catch (error) {
        res.status(401).send({
            success: false,
            error: error,
            message: "JOI in userSignUpValidation catch block"
        });
    }
};
exports.userLoginJOIValidation = (req, res, next) => {
    try {
        const { error, value } = userLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                success: false,
                error: error.details[0].message.split('\"').join(''),
                message: "JOI in userLoginValidation block"
            });
        }
        next();
    }
    catch (error) {
        res.status(401).send({
            success: false,
            error: error,
            message: "JOI in userLoginValidation catch block"
        });
    }
};
exports.userUpdateJOIValidation = (req, res, next) => {
    try {
        const { error, value } = userUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                success: false,
                error: error.details[0].message.split('\"').join(''),
                message: "JOI in userUpdateValidation block"
            });
        }
        next();
    }
    catch (error) {
        res.status(401).send({
            success: false,
            error: error,
            message: "JOI in userUpdateValidation catch block"
        });
    }
};
exports.sendEmailJOIValidation = (req, res, next) => {
    try {
        const { error, value } = sendEmailSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                success: false,
                error: error.details[0].message.split('\"').join(''),
                message: "JOI in sendEmailJOIValidation block"
            });
        }
        next();
    }
    catch (error) {
        res.status(401).send({
            success: false,
            error: error,
            message: "JOI in sendEmailJOIValidation catch block"
        });
    }
};
exports.resetPasswordJOIValidation = (req, res, next) => {
    try {
        const { error, value } = resetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                success: false,
                error: error.details[0].message.split('\"').join(''),
                message: "JOI in resetPasswordValidation block"
            });
        }
        next();
    }
    catch (error) {
        res.status(401).send({
            success: false,
            error: error,
            message: "JOI in resetPasswordValidation catch block"
        });
    }
};
