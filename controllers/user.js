import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import users from '../models/user.js'
import * as dotenv from 'dotenv';
dotenv.config();

const jwtsecret=process.env.JWT_SECRET;
 const signin=async (req,res)=>{
const {email,password}=req.body;


console.log(email)
try {
    const userExist=await users.findOne({email});
    if(!userExist){
       return res.status(404).json({message:"User doesn't exist \n"});
    }
    const isPasswordMatch=await bcrypt.compare(password,userExist.password);
    if(!isPasswordMatch){
       return  res.status(401).json({message:'Invalid Credentials'})
    }
    const token=jwt.sign({
        name:userExist.name,
        email:userExist.email,
        id:userExist._id
    },jwtsecret,{expiresIn:'30d'})
    res.status(200).json({result:userExist,token:token})
     
} catch (error) {
    res.status(500).json({error:error,errorMessage:error.message})
}
}
 const signup=async (req,res)=>{
    const {firstName,lastName,email,password,confirmPassword}=req.body;
     try {
        const userExist=await users.findOne({email});
        if(userExist){
            console.log('userExist',userExist)
            return res.status(400).json({message:'User already exists!'})
        }
        if(password!==confirmPassword){
            return res.status(400).json({message:'Password doesn\'t match'});
        }
        const hashedPassword=await bcrypt.hash(password,12);
        console.log(hashedPassword);
        const result=await users.create({
            email:email,
            password:hashedPassword,
            name:`${firstName} ${lastName}`,  
        })
        const token=jwt.sign({email:result.email,name:result.name,id:result._id},jwtsecret,{issuer: "http://localhost:3000/",expiresIn:'30d'})

        res.status(200).json({result:result,token})
     } catch (error) {
    res.status(500).json({error:error,errorMessage:error.message})
         
     }
    
  
}
export {signin,signup};
