const express = require('express')                              //imports
const router = express.Router()
const {Rental , validate} = require('../models/rental')
const {Movie} = require('../models/movie')
const {Customer} = require('../models/customer')
const Fawn = require('fawn')        //fawn is a dependecy needed to group tasks together and check if their all done
const mongoose = require('mongoose')
const auth = require('../middleware/auth')

Fawn.init(mongoose)         //initializing the Fawn class with mongoose
 
router.get('/',async (req,res)=> {
    const rentals = await Rental.find().sort('-dateOut')
    res.send(rentals)
})

router.post('/',auth, async (req,res)=>{
    const {error } = validate(req.body)                                     //checking if the user input is valid ( attributes and values)
    if(error) return res.status(400).send(error.details[0].message)         //if not valid resturn a response with status 400
    //once valid

    const customer = await Customer.findById(req.body.customerId)           //finds the customer object with the id from the request 
    if(!customer) return res.status(400).send("Invalid customer.")          //if not found send response with status 400
    //when customer found 

    const movie = await Movie.findById(req.body.movieId)                    //finds the movie with the corresponding id
    if(!movie) return res.status(400).send('Incalid movie.')                //sending a response with error if not
    //when movie found

    if(movie.numberInStock === 0 )return res.status(400).send("Movie out of stock")    //checking if there still is in stock
    //if left

    const newRental = new Rental({                      //creating a new rental 
        customer : {
            _id : customer._id,
            name: customer.name,
            phone : customer.phone
        },
        movie : {
            _id : movie._id,
            title: movie.title,
            dailyRentalRate : movie.dailyRentalRate
        }
    }) 
 
    try{                                                        //try catch block
        new Fawn.Task()                                         //creating a new Fawn task to deal with
            .save('rentals',newRental)                          //saving the new rental object
            .update('movies', { _id : movie._id},               //updating the movie.numberInStock variable (decrementing)
            { $inc : {numberInStock : -1}})
            .run()                                              //running the task ----NESECCARY!!!----
        res.send(newRental) 
    }catch(ex){                                                 //catching an exception
        res.status(500).send('Something Failed')                //responding with status 500
    }
   
}) 

module.exports = router         //exporting the router