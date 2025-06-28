import dotenv from "dotenv"
import connectDB from "./database-connect/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

//Approach 1: Chained .then().catch() Promise Style
//here we import the connect db
const database= connectDB()

database.then(()=>{


    app.listen(process.env.PORT || 8002,()=>{
          console.log(`server is running at ${process.env.PORT}`)
    })
    app.on("error",(error)=>{
        console.log(`getting error`,error);
        throw error
    })
})
.catch((error)=>{
    console.log("Mongodb connection failed !! ",error)
    process.exit(1)
})