const mongoose = require('mongoose')
const Joi = require ('Joi')


const rentalSchema = mongoose.Schema({
    customer : {
        type : new mongoose.Schema({                // specifying that the customer variable takes a customer object 
            name: {                                 // following a new customerSchema scpecialized to minimize
                type : String,                      // the attributes we get or we need to specify
                required : true,
                minlength :5,
                maxlength : 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone : {
                type: String,
                required : true,
                validate :{
                    validator : function(v){
                        return v.length === 8 
                    },
                    message : 'Phone must be in 8 characters'
                }
            }
        })
    },
    movie : {
        type : new mongoose.Schema({                //same thing for the movie variable
            title: {
                type : String,
                required : true,
                trim: true,
                minlength : 5,
                maxlength : 200
            },
            dailyRentalRate : {
                type: Number,
                required : true,
                min: 0,
                max : 200
            }
        }),
        required : true
    },
    dateOut : {
        type: Date,
        required : true,
        default : Date.now          //sets the default date as now    
    },
    dateReturned : {
        type: Date
    },
    rentalFee : {
        type: Number,
        min : 0
    }
})

const Rental = mongoose.model('Rental',rentalSchema)

function validRental(rental){
    
    const schema= {
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    }
    return Joi.validate(rental, schema)
}

exports.Rental = Rental;
exports.validate = validRental;