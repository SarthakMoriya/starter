// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))
const Tour = require("./../models/tourModel")
const APIFeatures = require('./../utilities/apiFeatures')
exports.aliasTopTour = (req, res, next) => {
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    req.query.limit = '5';
    req.query.page = '1'

    next();

};


exports.getAllTours = async (req, res) => {

    try {
        //EXECUTING THE QUERY
        //(queryObj,queryString)
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().pagination().fields();
        const tours = await features.query

        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            results: tours.length,
            Data: { tours }
        })
    } catch (err) { res.status(500).json({ status: "Failed", message: err.message }) }

}

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);
        //Tour.findOne({_id: req.params.id})
        res.status(200).json({
            status: "Success",
            data: tour
        })
    } catch (err) { res.status(500).json({ status: "Failed", message: err.message }) }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)

        res.status(200).json({
            Status: "Success",
            Data: newTour
        })

    } catch (err) {
        res.status(500).json({ status: "Failed", message: err.message })
    }


}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findOneAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.status(200).json({
            status: "success",
            data: tour
        })
    } catch (err) { res.status(500).json({ status: "Failed", message: err.message }) }
}

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "success",
            data: tour
        })

    } catch (err) { res.status(500).json({ status: "Failed" }) }


}

exports.tourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            { $sort: { avgPrice: 1 } }
        ])

        res.status(200).json({
            status: 'Success',
            data: {
                stats
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: "Failed",
            message: err
        })
    }
}