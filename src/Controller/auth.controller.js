import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    try{
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword

        })
        await newUser.save();

        const token = jwt.sign({
            id: newUser._id},
            process.env.Jwt_secret,
            { expiresIn: "7d"}
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"  ? "none" : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        return res.status(201).json({success: true, message: "User registered successfully"});

        

    }catch(error){
        return res.status(400).json({success: false , message: "Error registering user", error: error.message})
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({success: false, message: " All fields are required"});
    }

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({success: false, message: "Invalid email or password"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({success: false, message: "Invalid email or password"})
        }

        const token  = jwt.sign({
            id: user._id},
            process.env.Jwt_secret,
            { expiresIn: "7d"}
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"  ? "none" : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        return res.status(200).json({success: true, message: "User logged in successfully"});

    }catch(error){
        return res.status(400).json({success: false , message: "Error logging in user", error: error.message})
    }
}