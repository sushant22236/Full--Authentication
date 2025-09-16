import userModel from '../model/user.model.js';
import { transport } from '../utils/sentEmail.js';
import { config } from '../config/env.js';
import bcrypt from 'bcrypt';

export const sendPasswordResetOtp = async (req, res) => {
    const {email} = req.body;

    if(!email){
        return res.status(400).json({success: false, message: "Email is required"});
    }
    try{
        const user = await userModel.findOne({email});
        
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
            user.resetOtp = otp;
            user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes

            await user.save();
        
            const mailOptions = {
                from: config.smtpApi.senderEmail,
                to: user.email,
                subject: "Password reset OTP",
                text: `Hello ${user.name}, your otp for password reset is ${otp}. It will expire in 10 minutes.`
            };
        
            await transport.sendMail(mailOptions);

            return res.status(200).json({success: true, message: "Password reset OTP sent to your email"})

    }catch(error){
        return res.status(400).json({success: false, message: "Error in password reset", error: error.message});
    }
}

export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        if(user.resetOtp === " " || user.resetOtp !== otp){
            return res.status(400).json({success: false, message: "Invalid OTP"})
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.status(400).json({success: false, message: "OTP expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = " ";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({success: true, message: "Password reset successfully"})

    }catch(error){
        return res.status(400).json({success: false, message: "Error in resetting password", error: error.message});
    }
}
