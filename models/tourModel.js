const mongoose = require("mongoose")
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a NAME!!'],
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        default: 5000,
        required: true,
    },
    ratingsAverage: {
        type: Number,
        default: 4.4,

    },
    MaxGroupSize: {
        type: Number,
        default: 5,
        required: [true, "Number of People must be knowed beforehand"]

    },
    difficulty: {
        type: String,
        default: "intermediate"
    },
    ratingsQuantity: {
        type: Number
    },
    summary: {
        type: String,
        required: [true, "Summary is Neccessary"]
    },
    discount:{
        type:Number
    },
    description:{
        type:String,
        required: [true, "Description is Neccessary"]
    },
    imageCover:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date],
    image:{
        type:String
    }
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour