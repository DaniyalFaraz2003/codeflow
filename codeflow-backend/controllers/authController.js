const jwt = require("jsonwebtoken");
const User = require("../db/models/user");


const register = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const user = new User({
            name,
            username,
            password,
            image: ''
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        req.session.userId = user._id;

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: parseInt(process.env.COOKIE_MAX_AGE),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                image: user.image
            },
            token
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error during registration" });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        req.session.userId = user._id;

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: parseInt(process.env.COOKIE_MAX_AGE),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                image: user.image
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error during login" });
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error during logout" });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Internal server error during fetching user" });
    }
}

module.exports = {
    register,
    login,
    logout,
    getUser
}