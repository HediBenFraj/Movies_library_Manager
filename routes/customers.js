const express= require('express')       // requiring express
const router = express.Router()         //creating and express.Router instance called router
const {Customer, validate} = require('../models/customer')  // requiring the customer model
const auth= require('../middleware/auth')

router.get('/',async (req,res)=>{                 //get request to the api/genres route    we need to put async cause we're using await inside 
    const customer = await Customer.find()        //find return an array with all the customers we need to put await cause it's a promise
    res.send(customer)       //return the genre array in the response
})

router.get('/:id', async (req,res)=>{             // get request for a single genre usin id
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send("no item found with this id")   // Logging an 404 not found error
    res.send(customer)    // in case it exists we send it back in the response
 })

router.post('/',auth,async (req,res)=>{     // post request to the api/genres url to create new genre

    const { error } = validate(req.body)  // calling the validate genre and destructuring the error property
    if(error) return res.status(400).send(error.details[0].message) // logging and error if it exists 

    const newCustomer = new Customer({
        name : req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold
    })  // else we create a newCustomer with a new id and the title being the request body title 
    const result = await newCustomer.save()       //pushing it to our dataSet
    res.send(result)          //returning it back in the response
})

router.put('/:id',auth,async (req,res)=>{          //put request to api/genres/:id to update the element with the  given element id in req.params.id
    const { error } = validate(req.body)      //checkking the validity of the input 
    if(error) return res.status(400).send(error.details[0].message) //logging error message if invalid

    const customer = await Customer.findByIdAndUpdate(req.params.id, {  //finding by id and updating
        name : req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold
    },{new : true})

    if(!customer) return res.status(404).send("no item found with this id")   //logging error if not 

    res.send(customer)        //sending the upadted element in the response
})

router.delete('/:id',auth,async (req,res)=>{       //delete request to api/genres/:id to delete the element with the given id
    const customer = await Customer.findByIdAndRemove(req.params.id)        //fidning by id an removing

    if(!customer) return res.status(404).send("no item found with this id")   //logging error if not
   
    res.send(customer)    //responding with the deleted element
})


module.exports =router      // exporting the router

