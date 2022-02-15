const express = require("express");
const { validateUser, validateSignIn } = require("../utils/userValidator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const helper = require("../config/helper");

exports.signUp = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        let { username, firstName, lastName, password, phone, address } = req.body;
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).send("User already exists");
        let hash = bcrypt.hashSync(password);
        password = hash;

        const newUser = {
            username,
            firstName,
            lastName,
            password,
            phone,
            address,
        };
        const user = await User.create(newUser);
        res.status(201).json({
            status: "success",
            message: "Successfully signed up",
            user
        });
    } catch (error) {
        return res.status(400).json({ message: "User already registered" });
    }
};

exports.signIn = async (req, res) => {
    const { error } = validateSignIn(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send("User does not exist");
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).send("Invalid password");
        const signature = {
            username,
            password
        }
        const token = helper.createAccessToken(signature);
        res.status(200).json({
            status: "success",
            message: "User signed in successfully",
            userId: user._id,
            token
        });
    } catch (error) {
        return res.status(400).json({ message: "Error signing in" });
    }
};