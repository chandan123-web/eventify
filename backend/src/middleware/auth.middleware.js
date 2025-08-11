import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const verifyJWT = async(req, res, next) => {
    console.log("Verifying JWT middleware");
    try {
        const token = req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ", "")
        
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Access token is required" });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid access token" });

        }
        console.log("Token received:");

        req.user = user;
        console.log("User authenticated:", user._id);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid access token", error: error.message });
    }
}