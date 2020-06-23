const express=require('express')        //importing express
const router=express.Router()           //creating a router instance from express.router
const {Genre, validate} = require('../models/genre')
const auth = require('../middleware/auth')
const admin= require('../middleware/admin')

router.get('/',async (req,res)=>{                 //get request to the api/genres route  
    const genres = await Genre.find()
    res.send(genres)       //return the genre array in the response
})

router.get('/:id', async (req,res)=>{             // get request for a single genre usin id
    const genre = await Genre.findById(req.params.id)
    if(!genre) return res.status(404).send("no item found with this id")   // Logging an 404 not found error
    res.send(genre)    // in case it exists we send it back in the response
 })

router.post('/',auth ,async (req,res)=>{     // post request to the api/genres url to create new genre


    const { error } = validate(req.body)  // calling the validate genre and destructuring the error property
    if(error) return res.status(400).send(error.details[0].message) // logging and error if it exists 

    const newGenre = new Genre({title: req.body.title})  // else we create a newGenre with a new id and the title being the request body title 
    const result = await newGenre.save()       //pushing it to our dataSet
    res.send(result)          //returning it back in the response
})

router.put('/:id',auth,async (req,res)=>{          //put request to api/genres/:id to update the element with the  given element id in req.params.id
    const { error } = validate(req.body)      //checkking the validity of the input 
    if(error) return res.status(400).send(error.details[0].message) //logging error message if invalid

    const genre = await Genre.findByIdAndUpdate(req.params.id, { title : req.body.title},{new : true})

    if(!genre) return res.status(404).send("no item found with this id")   //logging error if not 

    res.send(genre)        //sending the upadted element in the response
})

router.delete('/:id',[auth,admin],async (req,res)=>{       //delete request to api/genres/:id to delete the element with the given id
    const genre = await Genre.findByIdAndRemove(req.params.id)

    if(!genre) return res.status(404).send("no item found with this id")   //logging error if not
   
    res.send(genre)    //responding with the deleted element
})


module.exports =router      // exporting the router