const mongoose = require('mongoose')        //requiring mongoose
const Joi = require('Joi')  //requiring Joi
            
const customerSchema = new mongoose.Schema({        //creating a customer schema to specify the properties of our customer
    name : {                                        //name property
        type : String,                                  //type String
        required : true,                                //required : true means it's necessary
        minlength : 3,                                  //minlength
        maxlength :30,                                  //max length
        trim : true,                                    //removes white space before and after
        uppercase : true                                //makes it all uppercase
    },
    phone : {                                       //phone properrty
        type: String,                                   
        required : true,
        minlength : 3,
        maxlength :30,
        validate : {                                    //validate let's us specify a custom treatment before accepting the value
            validator : function(v) {                   //validate is an object that has a property called validator
                return v.length === 8                   //this property takes a function with the value as a paramerter value being the user input 
            },                                          //if the result is true the value is accepted
            message : 'A phone should have 8 numbers'   //else we log the second  parameter of the validate object : message
        }
    },
    isGold : {
        type : Boolean,
        default: false                                  //specifyigng a default value
    }
})


const Customer = mongoose.model('Customer',customerSchema)      //Creating the customer model based on the custoemrSchema


function validCustomer(customer){         // validity check fucntion 
    const schema = { name : Joi.string().min(5).max(50).required(),     //defiin a schema with parameters for all the properties of the object
    phone : Joi.string().min(5).max(50).required(), // phone must be a string wwith minlength : 5 maxlength : 50 and is necessary
    isGold: Joi.boolean()
}    // creating a new schema variable = object with the neeed proprieties : restrictions
    return Joi.validate(customer, schema)  //returning the resulting of the comparing between the schema and the user input
}


exports.Customer = Customer;        //exporting the customer model
exports.validate = validCustomer;   //exporting the validate function