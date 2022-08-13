const express = require('express')
const tourRouter = express.Router();
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
tourRouter.param(`id`,(req,res,next,val)=>{
    console.log(`Tour ID:: ${val}`);

    next();
})

tourRouter.route('/top-5-cheap').get(tourController.aliasTopTour,tourController.getAllTours)
tourRouter.route('/tour-stats').get(tourController.tourStats)

tourRouter
    .route('/')
    .get(authController.protect,tourController.getAllTours)
    .post(tourController.createTour)


tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour)


module.exports = tourRouter;