import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import { UserModel } from "../../models/index";
import { transporter } from "../../config/index";

export const userRegistration = async (req: express.Request, res: express.Response) => {

  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (user) {
      return res.status(300).send({
        message: "User Already Exist",
        status: false
      })
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(300).send({
        message: "Password and confirmPassword are Not Matched",
        status: false
      })
    }

    const genSalt = await bcrypt.genSalt(Number(process.env.SALT as string))

    const hashPassword = await bcrypt.hash(req.body.password, genSalt)

    const newUser = new UserModel({ ...req.body, password: hashPassword })

    const save = await newUser.save()

    if (save) {
      return res.status(200).send({
        message: "User Registered",
        status: true,
        user: save
      })
    }

  } catch (error) {
    console.log("error in userRegistration", error)
  }

}

export const userLogin = async (req: express.Request, res: express.Response) => {

  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(300).send({
        message: "User Not Found",
        status: false
      })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password as string)

    if (!validPassword) {
      return res.status(300).send({
        message: "Invalid Credentials",
        status: false
      })
    }

    const token = jwt.sign({ _id: user._id, version: user.version }, process.env.JWT_KEY as string, { expiresIn: "1d" })

    return res.status(200).send({
      message: "User Logged In",
      status: true,
      token: token
    })
  } catch (error) {
    console.log("error in userLogin", error)
  }
}

export const userUpdate = async (req: express.Request, res: express.Response) => {

  try {
    const user = await UserModel.findById((req.user as { _id: string })._id)

    if (req.body.newPassword) {

      const compare = await bcrypt.compare(req.body.password, user?.password as string)

      if (compare) {

        const genSalt = await bcrypt.genSalt(Number(process.env.SALT as string))

        const hashPassword = await bcrypt.hash(req.body.newPassword, genSalt)

        const updateUser = await UserModel.findByIdAndUpdate({ _id: user?._id }, { $set: { ...req.body, password: hashPassword } }, { new: true })

        return res.status(301).send({
          message: "Password Updated",
          status: true,
          user: updateUser
        })
      }
      return res.status(401).send({
        message: "Old Password Not Matched",
        status: false
      })
    }
    const updateUser = await UserModel.findByIdAndUpdate({ _id: user?._id }, { $set: req.body }, { new: true })

    return res.status(301).send({
      message: "User Updated",
      status: true,
      user: updateUser
    })

  } catch (error) {
    console.log("error in changeUserPassword catch", error)
  }
}

export const getUserData = async (req: express.Request, res: express.Response) => {

  try {
    const user = await UserModel.findById((req.user as { _id: string })._id)
    return res.status(200).send({
      message: "User Data Successfully Fetched",
      status: true,
      user: user
    })
  } catch (error) {
    console.log("error in getUserData catch", error)
  }
}

export const sendUserPasswordResetEmail = async (req: express.Request, res: express.Response) => {

  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(401).send({
        message: "Email Not Found",
        status: false
      })
    }

    const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_KEY as string, { expiresIn: "10m" })

    const resetLink = `http://localhost:3000/api/user/reset/${user._id}/${resetToken}`

    let info = await transporter.sendMail({
      from: `"Rohit Kumar " <${process.env.EMAIL_FROM}>`,
      to: [user.email as string],
      subject: "Password Reset",
      html: `<a href="${resetLink}">Click Here</a> to Reset Your Password`
    })

    return res.status(200).send({
      message: "Password Reset Email Sent. Please Check Your Email.",
      status: true,
      link: resetLink,
      info: info
    })
  } catch (error) {
    console.log("error in sendUserPasswordResetEmail catch", error)
  }
}

export const resetUserPassword = async (req: express.Request, res: express.Response) => {

  try {
    const { password, confirmPassword } = req.body
    const { _id, token } = req.params

    if (password !== confirmPassword) {
      return res.status(401).send({
        message: "Password and confirmPassword are Not Matched",
        status: false
      })
    }

    const user = await UserModel.findById(_id)

    try {
      const verify = jwt.verify(token, process.env.JWT_KEY as string)

    } catch (error) {

      return res.status(401).send({
        message: (error as Error).message === "jwt expired" ? "Token is Expired" : "Invalid Token",
        error: error,
        status: false
      })
    }

    const genSalt = await bcrypt.genSalt(Number(process.env.SALT as string))

    const hashPassword = await bcrypt.hash(password, genSalt)

    const updateUser = await UserModel.findByIdAndUpdate({ _id: user?._id }, { $set: { password: hashPassword }, $inc: { version: 1 } }, { new: true })

    if (updateUser) {
      return res.status(200).send({
        message: "Password Reset Successfully",
        status: true,
        user: updateUser
      })
    }

  } catch (error) {
    console.log("error in resetUserPassword catch", error)
  }
}
