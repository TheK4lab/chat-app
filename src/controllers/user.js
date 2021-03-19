const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config');

exports.SignUp = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = new User({ name, email, password });
    try {
        const userExist = await User.findOne({ email });
        if(userExist) {
            return res.status(403).json({ message: "User already exists" })
        }
        await bcrypt.hash(user.password, 12);
        await user.save();
        console.log("USER CREATED", user);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

exports.Login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ email, password });
        if(!user) {
            return res.status(404).json({ message: "Unable to find the user"});
        }
        const passwordMatching = await bcrypt.compare(password, user.password);
        if(!passwordMatching) {
            return res.status(401).json({ message: "Unable to login" });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: "1h"});
        console.log("USER LOGGED IN", user);
        res.status(200).json({user, token});
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

exports.Logout = async (req, res) => {
    const user = req.user;
    try {
        // We use filter() to delete THAT token (the one associated to the device)
        user.tokens = user.tokens.filter((token) => {
            return token.token !== req.token; // returns the token founded with .filter()
        });
        await req.user.save();
        res.status(200).json({message: "Disconnected"});
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}