import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../model/user.model.js';
import { transport } from '../utils/sentEmail.js';
import { config } from '../config/env.js';


export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    try{
        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.status(409).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
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

        // send welcome email
        const mailOptions = {
            from: config.smtpApi.senderEmail,
            to: newUser.email,
            subject: "Welcome to sushant singh App",
            text: `Hello ${newUser.name}, thanku for registering on our app.`
        }

        await transport.sendMail(mailOptions);

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
        const user = await userModel.findOne({email});

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

export const logoutuser = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : 'strict',
        });

        return res.status(200).json({success: true, message: "User logged out successfully"});
    }catch(error){
        return res.status(400).json({success: false , message: "Error logging out user", error: error.message})
    }
}