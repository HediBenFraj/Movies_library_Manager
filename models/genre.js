const Joi =require('Joi')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength : 5,
        maxlength :30
    }
})

const Genre = mongoose.model('Genre',genreSchema)


function validGenre(genre){         // validity check fucntion 
    const schema = { title : Joi.string().min(4).required()}    // creating a new schema variable = object with the neeed proprieties : restrictions
    return Joi.validate(genre, schema)  //returning the resulting of the comparing between the schema and the user input
}


exports.Genre = Genre;
exports.validate = validGenre;
exports.genreSchema = genreSchema