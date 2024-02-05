import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import { connect } from "./config/index"
import userRoutes from './routes/index'
import {userPassportValidation} from './lib/index'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

userPassportValidation(passport)

app.get("/api", (req: express.Request, res: express.Response) => res.send("Hello World"))
app.use("/api/user", userRoutes)

app.use((error: any, req: express.Request, res: express.Response,) => {
  res.status(400).send({
    message: error
  })
})

connect(process.env.MONGO_URL as string)

app.listen(process.env.PORT, () => console.log(`Server Started at Port ${process.env.PORT}`))