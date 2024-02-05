import express from "express"
import { getUserData, resetUserPassword, sendUserPasswordResetEmail, userLogin, userRegistration, userUpdate } from "../controllers/index"
import { resetPasswordJOIValidation, sendEmailJOIValidation, userLoginJOIValidation, userSignUpJOIValidation, userUpdateJOIValidation } from "../lib/index"
import passport from "passport"

const router = express.Router()

const verifyUser = passport.authenticate("jwt", { session: false })

router.post("/signup", userSignUpJOIValidation, userRegistration)
router.post("/login", userLoginJOIValidation, userLogin)
router.post("/sendPasswordResetEmail", sendEmailJOIValidation, sendUserPasswordResetEmail)
router.post("/resetPassword/:_id/:token", resetPasswordJOIValidation, resetUserPassword)
router.put("/update", userUpdateJOIValidation, verifyUser, userUpdate)
router.get("/profile", verifyUser, getUserData)

export default router