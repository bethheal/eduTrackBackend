import mongoose from "mongoose";

const url = process.env.MONGO_URL

async function connect(){
    try {
        const connectDB = await mongoose.connect(url);
    console.log("MONGODB CONNECTED SUCCESSFULLY 🚀🚀 ")
    } catch (error) {
        console.log(error)
        
    }
    
}
export default connect;