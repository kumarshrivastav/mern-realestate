import mongoose from "mongoose"
export default async function ConnectDB(){
    try {
        const conn=await mongoose.connect(process.env.MONGO_DB_URL_STRING)
        console.log(`MongoDB Connected at ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}