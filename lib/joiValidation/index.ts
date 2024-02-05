import express, { Request, Response } from "express"
import Joi from "joi"

const userSignUpSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  tc: Joi.boolean().required()
})

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().required()
})

const userUpdateSchema = Joi.object({
  name: Joi.string().optional().trim(),
  email: Joi.string().email().optional().trim(),
  password: Joi.string().optional(),
  newPassword: Joi.string().optional()
})

const sendEmailSchema=Joi.object({
  email:Joi.string().email().required().trim()
})

const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  confirmPassword: Joi.string().required()
})



export const userSignUpJOIValidation = (req: Request, res: Response, next: express.NextFunction) => {

  try {
    const { error, value } = userSignUpSchema.validate(req.body)

    if (error) {
      return res.status(400).send({
        success: false,
        error: error.details[0].message.split('\"').join(''),
        message: "JOI in userSignUpValidation block"
      })
    }
    
    next()

  } catch (error) {
    res.status(401).send({
      success: false,
      error: error,
      message: "JOI in userSignUpValidation catch block"
    })
  }

}

export const userLoginJOIValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  try {
    const { error, value } = userLoginSchema.validate(req.body)
    if (error) {
      return res.status(400).send({
        success: false,
        error: error.details[0].message.split('\"').join(''),
        message: "JOI in userLoginValidation block"
      })
    }
    next()

  } catch (error) {
    res.status(401).send({
      success: false,
      error: error,
      message: "JOI in userLoginValidation catch block"
    })
  }
}

export const userUpdateJOIValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  try {
    const { error, value } = userUpdateSchema.validate(req.body)
    if (error) {
      return res.status(400).send({
        success: false,
        error: error.details[0].message.split('\"').join(''),
        message: "JOI in userUpdateValidation block"
      })
    }
    next()

  } catch (error) {
    res.status(401).send({
      success: false,
      error: error,
      message: "JOI in userUpdateValidation catch block"
    })
  }
}

export const sendEmailJOIValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  try {
    const { error, value } = sendEmailSchema.validate(req.body)
    if (error) {
      return res.status(400).send({
        success: false,
        error: error.details[0].message.split('\"').join(''),
        message: "JOI in sendEmailJOIValidation block"
      })
    }
    next()
  }catch(error){
    res.status(401).send({
      success: false,
      error: error,
      message: "JOI in sendEmailJOIValidation catch block"
    })
  }  
}

export const resetPasswordJOIValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  try {
    const { error, value } = resetPasswordSchema.validate(req.body)
    if (error) {
      return res.status(400).send({
        success: false,
        error: error.details[0].message.split('\"').join(''),
        message: "JOI in resetPasswordValidation block"
      })
    }
    next()
  }catch(error){
    res.status(401).send({
      success: false,
      error: error,
      message: "JOI in resetPasswordValidation catch block"
    })
  }
}