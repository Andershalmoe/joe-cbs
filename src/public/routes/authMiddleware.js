import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        console.error("No token provided");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.ip !== req.ip || decoded.ua !== req.headers['user-agent']) {
            console.error("Token context mismatch");
            return res.status(401).json({ message: "Token context mismatch" });
        }

        req.user = decoded; 
        next();
    } catch (error) {
        console.error("JWT validation error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
