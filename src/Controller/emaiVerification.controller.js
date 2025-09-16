import userModel from '../model/user.model.js';
import { transport } from '../utils/sentEmail.js';
import { config } from '../config/env.js';

// new function to send otp for email verification
export const sendOtpVerifyEmail = async (req, res) => {

    try{
        const userId = req.userId;

        const user = await userModel.findById(userId);
        console.log(user);

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        if(user.isAccountVerified){
            return res.status(200).json({success: true, message: "Account already verified"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const mailOptions = {
            from: config.smtpApi.senderEmail,
            to: user.email,
            subject: "otp send for email verification",
            text: `Hello ${user.name}, your otp for email verification is ${otp}. It will expire in 10 minutes.`
        }

        console.log(mailOptions);
        await transport.sendMail(mailOptions);

        return res.status(200).json({success: true, message: "verification OTP sent to your email",})
        

    }catch(error){
        return res.status(400).json({success: false, message: "Error verifying email", error: error.message});
    }
}

// new function to verify email

export const verifyEmail = async (req, res) => {

    const {otp} = req.body;
    const userId = req.userId;

    if(!userId || !otp){
        return res.status(400).json({success: false, message: "All fields are required"})
    }

    try{
        const user = await userModel.findById(userId);
        
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }

        if(user.verifyOtp === " " || user.verifyOtp !== otp){
            return res.status(400).json({success: false, message: "Invalid otp"})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.status(400).json({success: false, message: "Otp expired"})
        }
        user.isAccountVerified = true;
        user.verifyOtp = " ";
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({success: true, message: "Email verified successfully"});

    }catch(error){
        return res.status(400).json({success: false, message: "Error verifying email", error: error.message});
    }
}

// new function to check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try{
        return res.status(200).json({success: true, message: "User is authenticated"});
    }catch(error){
        return res.status(400).json({success: false, message: "Error in authentication", error: error.message});
    }
}