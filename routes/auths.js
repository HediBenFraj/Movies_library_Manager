const _ = require('lodash')
const express = require('express')
const router = express.Router()
const {User} = require('../models/user')
const bcrypt = require('bcrypt')
const Joi = require('joi')

router.get('/',async (req,res)=>{
    const users= await User.find()
    res.send(users)
})

router.get('/:id', async (req,res)=>{             // get request for a single genre usin id
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send("no user found with this id")   // Logging an 404 not found error
    res.send(user)    // in case it exists we send it back in the response
 })

router.post('/',async (req,res)=>{
    const { error } = validate(req.body)
    if(error) return res.status(400).send('Invalid User Input.')

    let user = await User.findOne({email : req.body.email})
    if(!user) res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password')


    const token = user.generateAuthToken()

    res.send(token)
    })


function validate(req){
    const schema= {
        email : Joi.string().min(10).max(40).email(),
        password : Joi.string().min(6).max(200)
    }
    return Joi.validate(req,schema)
}


module.exports = router