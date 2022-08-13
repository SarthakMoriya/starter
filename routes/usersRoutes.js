const express = require('express')
const userRouter = express.Router();
const userController = require(`./../controllers/userController`)
const authController = require(`./../controllers/authController`)


userRouter.post('/signup', authController.signup)
userRouter.post('/login', authController.login)


userRouter.post('/forgotPassword', authController.forgotPassword)
userRouter.patch('/resetPassword/:token', authController.resetPassword)

userRouter
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

userRouter
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = userRouter