import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        };

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists! Try different email."
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully!"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again later."
        });

    }
};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        };

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials!"
            });
        };

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials!"
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        user = {
            id: user._id,
            email: user.email,
        }

        return res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000
            })
            .status(200).json({
                message: `Welcome back, ${user.email}!`,
                success: true,
                user
            });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again later."
        });
    }
};

export const logout = async (req, res) => {

    try {
        return res
            .cookie("token", "", { maxAge: 0 })
            .status(200).json({
                message: "Logged out successfully.",
                success: true
            });
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again later."
        });
    }
};

export const getProfile = async (req, res) => {

    try {

        const userId = req.params.id;
        let user = await User.findById(userId).select('-password');

        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again later."
        });
    }
};