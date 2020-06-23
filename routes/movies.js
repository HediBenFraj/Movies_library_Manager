const express=require('express')        //importing express
const router=express.Router()           //creating a router instance from express.router
const {Movie, validate} = require('../models/movie')
const {Genre} = require('../models/genre')
const auth = require('../middleware/auth')

router.get('/',async (req,res)=>{                 //get request to the api/genres route  
    const movies = await Movie.find()
    res.send(movies)       //return the genre array in the response
})

router.get('/:id', async (req,res)=>{             // get request for a single genre usin id
    const movie = await Movie.findById(req.params.id)
    if(!movie) return res.status(404).send("no item found with this id")   // Logging an 404 not found error
    res.send(movie)    // in case it exists we send it back in the response
 })

router.post('/',auth,async (req,res)=>{     // post request to the api/genres url to create new genre

    const { error } = validate(req.body)  // calling the validate genre and destructuring the error property
    if(error) return res.status(400).send(error.details[0].message) // logging and error if it exists 

    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send('Invalid genre')

    const movie = new Movie({
        title: req.body.title,
        genre : {
            _id: genre._id,
            title : genre.title
        },
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    })  // else we create a newMovie with a new id and the title being the request body title 
    
    const result = await movie.save()       //pushing it to our dataSet
    res.send(result)          //returning it back in the response
})

router.put('/:id',auth,async (req,res)=>{          //put request to api/genres/:id to update the element with the  given element id in req.params.id
    const { error } = validate(req.body)      //checkking the validity of the input 
    if(error) return res.status(400).send(error.details[0].message) //logging error message if invalid

    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
        title : req.body.title,
        genre : {
            _id: genre._id,
            title : genre.title
        },
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    },{new : true})

    if(!movie) return res.status(404).send("no item found with this id")   //logging error if not 

    res.send(movie)        //sending the upadted element in the response
})

router.delete('/:id',auth,async (req,res)=>{       //delete request to api/genres/:id to delete the element with the given id
    const movie = await Movie.findByIdAndRemove(req.params.id)

    if(!movie) return res.status(404).send("no item found with this id")   //logging error if not
   
    res.send(movie)    //responding with the deleted element
})


module.exports =router      // exporting the router