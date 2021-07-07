import PostMessage from'../models Schema/postMessage.js';//importing schema/Model 
import mongoose from 'mongoose';
//logics of routes are here

export const getPosts = async(req,res)=>{
    try {
        
        const postMessages =await PostMessage.find();//getting all the data from db
        //console.log("post messg:",postMessages);

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({message: error.message});
        console.log(error);
    }
}
export const getTrendingPosts = async (req,res)=>{
    console.log("trending");
    try {
        //sorting the posts according to number of likes
        const trendingPost = await PostMessage.aggregate([{                                                     
                                                    $project:{
                                                        _id:"$id",
                                                        numberOfLikes:{$size:"$likeCount"},
                                                        likeCount:"$likeCount",
                                                        title:"$title",                                                   
                                                        message:"$message",
                                                        name: "$name",
                                                        creator:"$creator",
                                                        tags:"$tags",
                                                        selectedFile: "$selectedFile",
                                                        
                                                    }
                                                }]).sort({"numberOfLikes":-1});
                                                       
        console.log("trending post:" ,trendingPost);
        res.status(200).json(trendingPost);
    } catch (error) {
        res.status(404).json({message: error.message});
        console.log(error);
    }
}

export const createPost = async(req,res)=>{
    const post = req.body;

    const newPost = new PostMessage({...post,creator:req.userId,createdAt: new Date().toISOString()});
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updatePost = async (req,res)=>{
    const {id:_id}  = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) 
        return res.status(404).send('No post with this id');
        
    const updatedPost =  await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new:true});
    res.json(updatePost);
}

export const deletePost = async(req,res)=>{
    const {id} = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(404).send('No post with this id');

    const deletedPost = await PostMessage.findByIdAndRemove(id);
    res.json({message:'post deleted!'});
}

export const likePost = async (req,res)=>{
    const {id} = req.params;
    
    if(!req.userId) return res.json({message:"unauthenticated"});

    if (!mongoose.Types.ObjectId.isValid(id))     return res.status(404).send('No post with this id');
    const post = await PostMessage.findById(id);
    
    const index = post.likeCount.findIndex((id)=> id === String(req.userId));
    if(index === -1){
        //like the post
        post.likeCount.push(req.userId);
    }else{
        //unlike
        post.likes = post.likeCount.filter((id)=>id!==String(req.userId));
    }

    const updatedpost = await PostMessage.findByIdAndUpdate(id,post,{new:true});

    res.json(updatedpost);
}
