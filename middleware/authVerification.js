const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
dotenv.config();

exports.userAuthentication = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findOne({ username: decodedToken.username });
            if (!user) {
                return res.status(401).json({ message: 'No token provided' });
            } else {
                req.user = user._id;
            }
        } else {
            return res.status(401).json({ message: 'Not Authorized' });
        }
    } catch (error) {
        return res.status(401).json({ error: error });
    }
    next();
};