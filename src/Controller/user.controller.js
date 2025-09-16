import userModel from '../model/user.model.js';

export const getUserDetails = async (req, res) => {

    try{
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        return res.status(200).json
        ({success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            }
        })
    }catch(error){
        return res.status(400).json({success: false, message: "Error fetching user details", error: error.message});
    }
}