const User = require('../models/userModel')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { promisify } = require('util')
const AppError = require("./../utilities/appError")
const sendEmail = require("./../utilities/email")

dotenv.config({ path: './../config.env' })

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signup = async (req, res, next) => {
    try {
        const user = await User.create({
            role: req.body.role,
            name: req.body.name,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            email: req.body.email,
            passwordChangedAt: req.body.passwordChangedAt,
        })


        const token = signToken(user._id)

        res.status(201).json({
            status: "success",
            token,
            message: user
        })
    } catch (err) {
        res.status(500).json({ status: "failed", message: err })
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    // 1) Check if Email  and Password Exists
    if (!email || !password) return new AppError("Please enter a  email and password!", 404)

    // 2)Check if user exists && password is Correct
    const user = await User.findOne({ email }).select('+password')
    // console.log(user);

    if (!user || !(await user.correctPassword(password, user.password)))
        return new AppError("Please enter a valid email or password", 401)

    // 3) If everyThing ok send Token to Client
    const token = signToken(user._id)

    res.status(201).json({
        message: "Success",
        token
    })
}

exports.protect = async (req, res, next) => {
    //1)Getting the token and checking it is there
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);

    if (!token) {
        return next(new AppError('You are Not Logged In Please Log In', 401))
    }

    //2)Verification Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // console.log(decoded);

    //3)Check if User still exists
    const freshUser = await User.findById(decoded.id)

    if (!freshUser) {
        return next(new AppError("The user with this token is not Available", 401))
    }

    //4)Check if the user changed password after token was assigned
    if (freshUser.ChangedPasswordAfter(decoded.iat)) {
        return next(new AppError("User Recently changed the Password", 401))
    }

    //Grant access to protexcted Route
    req.user = freshUser
    next();
}

exports.restrictTo = (...roles) => {
    //...roles => ['admin','lead-guide']
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError('You are not allowed to perform this task!', 403))

        next()
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        // 1) Get user based on POSTed email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new AppError('There is no user with email address.', 404));
        }

        // 2) Generate the random reset token
        const resetToken = await user.createPasswordResetToken();
        console.log(resetToken);
        await user.save({ validateBeforeSave: false });
    } catch (err) {
        res.status(500).json({
            status: err.status,
            message: err.message
        })
    }
    // next()
}

exports.resetPassword = async (req, res, next) => {

}

//3)Send it to User's Email
// const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`

// const message = `Forgot your PASSWORD ? Send a PATCH request to ${resetURL} with the new Password and Password Confirm or if not just ignore this email`

// try {
//     await sendEmail({
//         email: user.email,
//         subject: "Your password reset Token (valid for 10 Minutes Only",
//         message
//     })
//     res.status(200).json({ status: "Success", message: "Token sent to your email!" })
// } catch (error) {
//     user.passwordResetToken = undefined,
//         user.passwordresetExpires = undefined
//     await user.save({ validateBeforeSave: false })

//     return next(new AppError("Error sending th email please try again later!", 500))
