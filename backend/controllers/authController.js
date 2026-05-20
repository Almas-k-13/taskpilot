const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

//Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "90d" });

};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInvitedToken } = req.body;

        // check if user already exixst
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already Exists" });
        }

        // Determine user role : Admin if correct token is provided, otherwise Member
        let role = "member";
        if (
            adminInvitedToken &&
            adminInvitedToken == process.env.ADMIN_INVITED_TOKEN
        ) {
            role = "admin";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // return user data with jwt
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc Login user
// @route POST /api/auth/login
// @access Public
// pwd 123abc
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // compare pwd
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // Return user data with jwt
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc Get user profile
// @route GET /api/auth/profile
// @access Private (Requires jwt)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private (Requires jwt)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile }