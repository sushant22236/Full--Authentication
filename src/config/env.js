import dotenv from 'dotenv';
dotenv.config();

export const config ={
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || " ",
    NODE_ENV: process.env.NODE_ENV || "development",
    Jwt_secret: process.env.Jwt_secret || " ",

    smtpApi: {
        smtpUser: process.env.SMTP_USER || " ",
        smtpPass: process.env.SMTP_PASS || " ",
        senderEmail: process.env.SENDER_EMAIL || " "
    },
    
}