const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:  true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ("Email is invalid!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("Password can't be 'password'");
            }
        }
    },
    // We store user's tokens inside an array so we make sure that he has a token for every device he uses to log in
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;