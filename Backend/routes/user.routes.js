const { Router } = require("express");
require('dotenv').config();
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const userRouter = Router();

// Debug line to check environment variables
console.log("Environment variables:", {
    secretKey: process.env.SECRET_KEY,
    mongoUrl: process.env.MONGO_URL
});

userRouter.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password, (error, result) => {
                if(result){
                    try {
                        const token = jwt.sign({ 
                            userId: user._id,
                            role: user.role,
                            email: user.email
                        }, process.env.SECRET_KEY);
                        
                        res.status(200).json({
                            message: "Login successful!",
                            token,
                            user: {
                                _id: user._id,
                                email: user.email,
                                name: user.name,
                                role: user.role
                            },
                            isDealer: user.role === 'dealer'
                        });
                    } catch (jwtError) {
                        console.error("JWT signing error:", jwtError);
                        res.status(500).json({ message: "Error creating authentication token" });
                    }
                } else {
                    res.status(401).json({ message: "Incorrect password" });
                }
            });
        } else {
            res.status(401).json({ message: "User not found" });
        }   
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Dealer login endpoint
userRouter.post("/dealer-login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email, role: "dealer" });
        if (user) {
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    try {
                        const token = jwt.sign({ userId: user._id, role: "dealer" }, process.env.SECRET_KEY);
                        res.status(200).json({
                            message: "Login successful!",
                            token,
                            user: {
                                _id: user._id,
                                email: user.email,
                                name: user.name,
                                role: "dealer"
                            }
                        });
                    } catch (jwtError) {
                        console.error("JWT signing error:", jwtError);
                        res.status(500).json({ message: "Error creating authentication token" });
                    }
                } else {
                    res.status(401).json({ message: "Incorrect password" });
                }
            });
        } else {
            res.status(401).json({ message: "Dealer account not found" });
        }
    } catch (error) {
        console.error("Dealer login error:", error);
        res.status(500).json({ error: error.message });
    }
});

userRouter.post("/register", async (req,res)=>{
    const {email, password, name, role = 'user'} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user){
            res.status(400).json({message: "User already exists"});
        } else {
            bcrypt.hash(password, 5, async(err, hash)=>{
                if(err){
                    res.status(400).json({error:err.message});
                } else {
                    const user = new UserModel({email, password:hash, name, role});
                    await user.save();
                    res.status(200).json({
                        message: "Registration successful!",
                        user: {
                            _id: user._id,
                            email: user.email,
                            name: user.name,
                            role: user.role
                        }
                    });
                }
            })
        }
    } catch (error) {
        res.status(400).json({error:error.message});
    }
});

module.exports = {userRouter};