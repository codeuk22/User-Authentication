import mongoose from "mongoose";

export const connect = async (MONGO_URL: string) => {
  try {
    const conn = await mongoose.connect(MONGO_URL)

    if (conn) console.log(`DB Connected`)

    else console.log("No DB Connected")

  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
