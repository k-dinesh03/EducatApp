const JWT = require('jsonwebtoken')
const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
var { expressjwt: jwt } = require("express-jwt");

//middleware

const requireSignIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});

// register controller
const registerController = async (req, res) => {
    try {
        const { username, email, userType, password, score, profilePic } = req.body;

        //validation
        if (!username) {
            return res.status(400).send({
                success: false,
                message: "Username is required"
            })
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required"
            })
        }
        if (!userType) {
            return res.status(400).send({
                success: false,
                message: "UserType is required"
            })
        }
        if (!password || password.length < 8) {
            return res.status(400).send({
                success: false,
                message: "Password is required"
            })
        }

        //existing user by email
        const existingUserByEmail = await userModel.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).send({
                success: false,
                message: "Email already exists"
            })
        }

        //hashed password
        const hashedPassword = await hashPassword(password);

        //save user
        const user = await userModel({ username, email, userType, password: hashedPassword, score, profilePic }).save();

        return res.status(200).send({
            success: true,
            message: "User created successfully"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Register API",
            error
        })
    }
};

// login controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide Email or Password..."
            })
        }

        //find user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User not found"
            })
        }

        //match password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        //Jwt token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        })

        //undefined password
        user.password = undefined;

        res.status(200).send({
            success: true,
            message: "Login Successfull",
            token,
            user,
        });
    }

    catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in Login API",
            error
        })
    }
};

// update controller
const updateController = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        //find user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User not found",
            });
        }

        //password validation
        if (password && password.length < 8) {
            return res.status(400).send({
                success: false,
                message: "Password is required and must be 8 characters long"
            })
        }

        //Check for existing user
        const existingUser = await userModel.findOne({ username });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            return res.status(400).send({
                success: false,
                message: "Username already exists",
            });
        }


        const hashedPassword = password ? await hashPassword(password) : undefined;

        //updated user
        const updatedUser = await userModel.findOneAndUpdate({ email }, {
            username: username || user.username,
            password: hashedPassword || user.password
        }, { new: true });

        updatedUser.password = undefined;

        res.status(200).send({
            success: true,
            message: "User updated successfully",
            updatedUser
        });

    }
    catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).send({
                success: false,
                message: "Username already exists.",
            });
        }
        res.status(500).send({
            success: false,
            message: "Error in Update API",
            error: error.message,
        });
    }
};

const updateProfilePic = async (req, res) => {
    try {
        const { profilePic, email } = req.body;
        //find user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User not found",
            });
        }

        console.log("User Profile : ", user.profilePic)

        //updated user
        const updatedUserProfile = await userModel.findOneAndUpdate({ email }, {
            profilePic: profilePic || user.profilePic,
        }, { new: true });

        res.status(200).send({
            success: true,
            message: "Profile Picture Uploaded",
            updatedUserProfile
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in profile picture api",
            error: error.message,
        });
    }
}

module.exports = { requireSignIn, registerController, loginController, updateController, updateProfilePic };