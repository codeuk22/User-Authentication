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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPassportValidation = void 0;
const index_1 = require("../../models/index");
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
exports.userPassportValidation = (passport) => {
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_KEY
    }, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield index_1.UserModel.findById(jwt_payload._id);
            if (!data)
                return done({ message: "UserId not found" }, false);
            if (jwt_payload.exp < Date.now() / 1000)
                return done({ message: "Token is Expired" }, false);
            if (data.version !== jwt_payload.version)
                return done({ message: "Token is Expired or Invalid Token, Login Again" }, false);
            return done(null, data, { message: "User Verified Successfully" });
        }
        catch (error) {
            console.log(error);
            return done({ message: "Invalid Token" }, false);
        }
    })));
};
