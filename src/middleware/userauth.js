import jwt from 'jsonwebtoken';
import {config} from '../config/env.js';

export const userAuth = (req, res, next) => {
    const token = req.body.cookies;
    console.log(token);

    if(!token){
        return res.status(401).json({success: false, message: "Unauthorized, no token provided"});
    }

    try{
        const tokenDecode = jwt.verify(token, config.Jwt_secret)

        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }else{
            return res.status(401).json({success: false, message: "Unauthorized, invalid token"})
        }

        next();

    }catch(error){
        return res.status(401).json({success: false, message: "Unauthorized, invalid token"})
    }
}