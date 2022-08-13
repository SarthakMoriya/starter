const Users = require('./../models/userModel')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.find()
        res.status(200).json({
            Status: "success",
            data: users
        })
    } catch (err) { res.status(500).json({ Status: "Failed", message: err.message }) }
}
exports.createUser = (req, res) => {
    res.status(200).json({ Status: "User Created", message: "Route not yet Defined!" })
}
exports.getUser = (req, res) => {
    res.status(200).json({ Status: "success", message: "Route not yet Defined!" })
}
exports.updateUser = (req, res) => {
    res.status(200).json({ Status: "User Updated", message: "Route not yet Defined!" })
}
exports.deleteUser = (req, res) => {
    res.status(200).json({ Status: "User Deleted", message: "Route not yet Defined!" })
}
