const User = require('../model/userAuth')
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const checkEmail = await User.findOne({ email: email })
        if (checkEmail) {
            return res.status(409).json({ message: "Email already exists", success: false })
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)
        await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.status(201).json({ message: "Account created successfully", success: true })
    } catch (error) {
        return res.status(500).json({ message: "Oops!!, an error occurred while registering", success: false, error: error.message })

    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email not found", success: false });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password", success: false });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1w" }
        );

        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: { id: user._id, username: user.name, email: user.email },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: "Login failed", success: false, error: error.message });
    }
}

const getAllUser = async (req, res) => {
    try {
        const allUser = await User.find()
        if(!allUser){
            res.status(404).json({message:"Not user found"})
        }
        return res.status(200).json({ allUser, success: true, });
    } catch (error) {
        return res.status(400).json({ message: error.message, success: false });
    }
};

module.exports = { createUser, signInUser, getAllUser }