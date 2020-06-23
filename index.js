const Joi = require('Joi')                        //requiring JOI
Joi.objectId = require('joi-objectid')(Joi)       //setting the joi.objectId as a function required from 'joi-objectID'    

const config = require('config')    //requiting config files
const morgan = require('morgan')    //requiring morgan dependency which is a middleware for logging our requests upon sending them
const helmet = require('helmet')    //another middleware
       // import joi to validate input according to schema     
const logger = require('./middleware/logger')       //personal middleware
const authenicator = require('./middleware/authenticator') //personal middleware
const express= require('express');     //imporing express which is a node framework to start the server     
const app = express();  //creating our app( server) by assiging it to express variable 
const genres =require('./routes/genres')    //requiring the genres-routes file
const homePage =require('./routes/homePage')    //requiring the homepage-routes file
const mongoose = require('mongoose')        //requireing mongoose
const customers = require('./routes/customers') //customers route file
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auths = require('./routes/auths')

app.set('view engine','pug')    //setting the view engine as pug
app.set('views','./views')      //setting the views directory

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR : jwtPrivateKey is not defined')
    process.exit(1)
}

mongoose.connect('mongodb://localhost/vidly')                   //connecting to mongoose dataBase by providing a conection string
    .then(()=> console.log("Connected to DataBase"))            //handling successfull connection
    .catch(err => console.error("Could not connect to DataBase"))   //handling faulty connection

app.use(express.json())     // using the middleaware function json from express to specifiying that our app will work with json
app.use(express.urlencoded({ extended: true}))  // this is a middleware available in the express framework which encodes our url
app.use(express.static('public'))   //specfying which public files the user can access from the url
app.use(helmet())       // using the helmet middleware
app.use('/api/genres', genres)  //specifying that our app uses the genres routes file while accessing the /api/genres route
app.use('/',homePage)   //specifying that our app uses the homepge routes file while accessing /
app.use('/api/customers', customers)    //specifiying that our app uses the customers routes file while accesssing /api/customers url
app.use('/api/movies',movies)
app.use('/api/rentals',rentals)
app.use('/api/users', users)
app.use('/api/auths',auths)
//configuration 
console.log(`Application name : ${config.get('name')}`) //logging name config variable
console.log(`Mail Server : ${config.get('mail.host')}`) //logging the host proeperty of the mail config variable



if(app.get('env') === 'development'){   //if the NODE_ENV variable is equal to 'development'
    console.log("morgan enabled")       // logg this
    app.use(morgan('tiny'))             //and use the morgan middleware
}

app.use(logger)     //speciftying that our appp uses the logger middleware created by us 

app.use(authenicator)   //specifying that our app uses the authenticator middleware



app.listen(3000,()=> console.log("listening on port 3000"))     //telling the app to start listening on the port 3000