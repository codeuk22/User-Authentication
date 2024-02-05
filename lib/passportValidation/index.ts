import {UserModel} from '../../models/index';
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;

export const userPassportValidation = (passport: any) => {

  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY
    },
    async (jwt_payload: any, done: any) => {

      try {
        
        const data = await UserModel.findById(jwt_payload._id)

        if (!data) return done({ message: "UserId not found" }, false)

        if (jwt_payload.exp < Date.now() / 1000) return done({ message: "Token is Expired" }, false)

        if (data.version !== jwt_payload.version) return done({ message: "Token is Expired or Invalid Token, Login Again" }, false)

        return done(null, data, { message: "User Verified Successfully" })

      } catch (error) {
        console.log(error)
        return done({ message: "Invalid Token" }, false)
      }

    })
  )
}
