import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import postRouter from "./routes/posts.js"
import userRoute from "./routes/users.js"
const app=express();
dotenv.config();

app.use(bodyParser.json({limit:"30mb",extended:true}));//this is for limiting the file size recieved from frontend
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));//this is for limiting the file size recieved from frontend
app.use(cors());
app.use("/posts",postRouter)
app.use('/users',userRoute)

const uri=process.env.MONGO_URL;
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    app.listen(4000,()=>{
        console.log("App is listening on port 4000");
    })
})
.catch((e)=>{
    console.log(e)
})
