function authenticator(req,res,next){  // declaring a middle ware fucntion
    console.log("Authenticating....")  // body of the fucntion
    next()  //invokes the nexxt middleware function. essential or else the program will freeze at this step
}


module.exports = authenticator // export the function