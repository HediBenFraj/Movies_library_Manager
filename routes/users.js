const _ = require('lodash')
const express = require('express')
const router = express.Router()
const {User,validate} = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')

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
    if(user) res.status(400).send('User already Register')

    const newUser= new User(_.pick(req.body, ['name','email','password']))

    const salt =await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(newUser.password,salt)

    user = await newUser.save()

    const token = user.generateAuthToken()

    res.header('x-auth-token',token).send(_.pick(user, ['_id','name','email']))
})

router.put('/:id',auth, async (req,res)=>{

    const {error } = validate(req.body)
    if(error) return res.status(400).send('Invalid User Input.')

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email : req.body.email,
        password: req.body.password
    },{
        new : true
    })

    if(!user) return res.status(400).send('No user found with this ID')

    res.send(user)
})

router.delete('/:id',auth, async (req,res)=>{
    const user  = await User.findByIdAndRemove(req.params.id)

    if(!user) return res.status(400).send('No user found with this Id')

    res.send(user)
})

module.exports = router