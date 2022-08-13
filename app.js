const express = require("express")
const AppError = require('./utilities/appError')
const globalErrorHandler=require('./controllers/errorHandler')
const app = express();
const morgan = require("morgan")

const tourRouter =require('./routes/toursRoutes')
const userRouter =require('./routes/usersRoutes')
//1) MIDDLEWARES
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
    console.log("Hello From MiddleWare");

    next();
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);

    next();
})





//3) ROUTES


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

//after users and tours this will be encountered

app.all('*',(req, res,next) => {
    // res.status(404).json({
    //     status:"Fail",
    //     message:`Could not found ${req.originalUrl} on this Server!`
    // })
    // const err=new Error(`Could not found ${req.originalUrl} on this Server!`)//this is err.message
    // err.status='fail'
    // err.statusCode=404;

    next(new AppError(`Could not found ${req.originalUrl} on this Server!`,404));
})
//GLOBAL MIDDLEWARE
app.use(globalErrorHandler)
module.exports = app;