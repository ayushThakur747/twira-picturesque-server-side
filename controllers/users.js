import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models Schema/user.js'

export const signin = async(req,res)=>{
    const {email,password} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message:"user doesn't exist. "});
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"invalid credentials"});
        
        const token = jwt.sign({email:existingUser.email,id:existingUser._id}, 'test', {expiresIn:'1h'});

        res.status(200).json({result: existingUser,token});
        
    } catch (error) {   
        res.status(500).json({message:"somthing went wrong"});
        console.log(error);
    }
}

export const signup = async(req,res)=>{
    const {email, password, confirmPassword, firstName, lastName} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({message:"user already exist. "});

        if(password !== confirmPassword) return res.status(400).json({message:"password dont match. "});

        const hasedpassword = await bcrypt.hash(password,12);

        const result = await User.create({email,password:hasedpassword,name:`${firstName} ${lastName}`});

        const token = jwt.sign({email:result.email,id:result._id}, 'test', {expiresIn:'1h'});

        res.status(200).json({result,token});

    } catch (error) {
        res.status(500).json({message:"somthing went wrong"});
        console.log(error);
    }
}

