import jwt from 'jsonwebtoken';
import {config} from '../config/env.js';

export const userAuth = (req, res, next) => {
    const token = req.cookies.token;

    console.log(token);
    
    if(!token){
        return res.status(401).json({success: false, message: "Unauthorized, no token provided"});
    }

    try{
        console.log(config.Jwt_secret);
        const tokenDecode = jwt.verify(token, config.Jwt_secret)
        console.log(tokenDecode);
        console.log(token);

        if(tokenDecode.id){
            console.log(tokenDecode.id);
            req.userId = tokenDecode.id;
            console.log(req.userId);
        }else{
            return res.status(401).json({success: false, message: "Unauthorized, token invalid token"})
        }

        next();

    }catch(error){
        return res.status(401).json({success: false, message: "Unauthorized, invalid token"})
    }
}