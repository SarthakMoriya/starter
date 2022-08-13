class APIFeatures {
    constructor(query, queryString) {
        this.query = query; //features.query ke equal hi hai yeh
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString }// {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields']

        excludeFields.forEach(field => delete queryObj[field])

        // console.log(queryObj);
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`)

        // let query = Tour.find(JSON.parse(queryString));
        this.query.find(JSON.parse(queryStr))
        //this.query is actually Tour.find()

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortby = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortby)
        }
        else {
            this.query = this.query.sort('price')
        }
        return this;

    }

    fields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
        else {
            this.query = this.query.select('-__v')
        }
        return this;

    }
    pagination() {
        if (this.queryString.page) {
            const page = this.queryString.page || 1;
            const limit = this.queryString.limit || 10;

            const skip = (page - 1) * limit;
            this.query = this.query.skip(skip).limit(limit)
        }
        return this;

    }
}
module.exports = APIFeatures;


//WITHOUT APIFEATURES CLASS

// exports.getAllTours = async (req, res) => {

    // try {

        //BUILDING THE QUERY 
        // const queryObj = { ...req.query }
        // const excludeFields = ['page', 'sort', 'limit', 'fields']

        // excludeFields.forEach(field => delete queryObj[field])

        // console.log(queryObj);
        // let queryString = JSON.stringify(queryObj)
        // queryString = queryString.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`)

        // let query = Tour.find(JSON.parse(queryString));

        //2)SORTING

        // if (req.query.sort) {
        //     const sortby = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortby)
        // }
        // else {
        //     query = query.sort('price')
        // }

        //4)LIMITING THE FIEDS
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ')
        //     query = query.select(fields)
        // }
        // else {
        //     query = query.select('-__v')
        // }


        //4)PAGINATION
        // if (req.query.page) {
        //     const page = req.query.page || 1;
        //     const limit = req.query.limit || 10;

        //     const skip = (page - 1) * limit;
        //     query = query.skip(skip).limit(limit)
        // }


        //EXECUTING THE QUERY
                                         //(queryObj,queryString)
//         const features = new APIFeatures(Tour.find(), req.query).filter().sort().pagination().fields();
//         const tours = await features.query

//         res.status(200).json({
//             status: "success",
//             requestedAt: req.requestTime,
//             results: tours.length,
//             Data: { tours }
//         })
//     } catch (err) { res.status(500).json({ status: "Failed", message: err.message }) }

// }