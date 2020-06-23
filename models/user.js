const mongoose = require('mongoose')
const Joi=require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email : {
        type: String,
        required : true,
        unique: true
    },
    password : {
        type: String,
        minlength : 6,
        maxlength : 1024,
        required : true
    },
    isAdmin : Boolean
})

userSchema.methods.generateAuthToken = function(){
    const token =jwt.sign({_id : this._id, isAdmin : this.isAdmin},config.get('jwtPrivateKey'))
    return token
}

const User = mongoose.model('User',userSchema)


function validUser(user){
    const schema= {
        name: Joi.string().min(5).max(20),
        email : Joi.string().min(10).max(40).email(),
        password : Joi.string().min(6).max(200)
    }
    return Joi.validate(user,schema)
}

exports.User = User
exports.validate = validUser
exports.userSchema = userSchema