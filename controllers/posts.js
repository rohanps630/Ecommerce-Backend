import mongoose from "mongoose";
import postMessage from "../models/postMessage.js";
 
 
 const getPosts=async (req,res)=>{
    try {
       const postMessages=await postMessage.find()
       res.status(200).json(postMessages);
    } catch (error) {
       res.status(404).json({message:error.message});
    }
}
 const createPost=async (req,res)=>{
    const post=req.body;
    console.log(post)
    const newPost=new postMessage({...post,creator:req.userId,createdAt:new Date().toISOString()});
   try {
      await newPost.save();
      res.status(201).json(newPost);

    }
    catch (error) {
       res.status(404).json({message:error.message});
       
   }
}
const updatePost =async (req,res)=>{
const {id: _id}=req.params;//renaming id to _id 
const post=req.body;
console.log(post)
if(!mongoose.Types.ObjectId.isValid(_id)){
 res.status(404).send('no post found with this id')
}else{
 const updatedPost=await postMessage.findByIdAndUpdate(_id,post,{new:true});
 res.json(updatedPost)
}
}
const deletePost=async (req,res)=>{
   const {id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(404).send('No post match with this id')
   }else{
      await postMessage.findByIdAndRemove(id);
      res.json('Item was successfully deleted')
   }
}
const likePost=async (req,res)=>{
   const {id}=req.params;
   console.log(id);
   if(!req.userId){
      return res.json({message:'unauthenticated'})
   }

   if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(404).send('No post match with this id');
   }else{
      const post=await postMessage.findById(id)
      const index=post.likes.findIndex((id)=>id===String(req.userId));
      console.log('>>>>>>> Index\n',index)

      if(index===-1){
         //like the post 
         post.likes.push(req.userId);
      }else{
         //dislike the post
         post.likes=post.likes.filter((id)=>id!==String(req.userId))
      }
      const updatedPost=await postMessage.findByIdAndUpdate(id,post,{new:true})
      console.log('>>>>>>UPDATED',updatedPost)
      res.json(updatedPost)

   }
}
export  {getPosts,createPost,updatePost,deletePost,likePost};