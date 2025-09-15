import dotenv from 'dotenv';
dotenv.config();

export const config ={
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || " ",
    NODE_ENV: process.env.NODE_ENV || "development",
    Jwt_secret: process.env.Jwt_secret || " "
}