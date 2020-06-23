const Joi =require('Joi')                       
const mongoose = require('mongoose')
const {genreSchema} = require('./genre')        //we require genre schema to specify that our movie has reference to genre

const movieSchema = new mongoose.Schema({
    title : {
        type:String,
        unique : true,
        required: true,
        minlength : 5 ,
        maxlength : 30,
        trim : true
    },
    genre : {
        type: genreSchema,          //specifying that this genre attribute gets a genre object following the genreschema
        required : true
    },
    numberInStock : {
        type : Number,
        required : true,
        min : 0,
        max : 200
    },
    dailyRentalRate: {
        type: Number,
        required : true,
        min: 0,
        max: 200
    }

})

const Movie= mongoose.model('Movie',movieSchema)


function validMovie(movie){
    const schema = {
        title :Joi.string().min(5).max(30).required(),
        genreId : Joi.objectId().required(),                //objectid verfies that the id is a valid mongoose id  before finding out if it's in the other objects or not
        numberInStock : Joi.number().required().min(0).max(200),
        dailyRentalRate : Joi.number().required().min(0).max(255)
    }
    return Joi.validate(movie,schema)
}

exports.Movie = Movie;      //exporting the Movie model to work with inthe routes   
exports.validate = validMovie;      //exporting the validMovie function as validate