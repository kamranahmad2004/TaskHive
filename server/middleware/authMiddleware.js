import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const authProtect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) 
            return res.status(401).json({ message: "Unauthorized: No token" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // req.user = await User.findById(decoded.id).select("-password");
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized", error: err.message });
    }
}

export default authProtect;