# Movies_library_Manager
this is the back-end for an application that manages your movies library using expressJS(NodeJs) and mongoose with Jwt authentication/authorization.

in this application i implemented jwt authentication/authorization.

to get it working on your machine: 
1) clone the project.
2) navigate to its directory with a command prompt and run "npm install"
2) after that run this command :"set vidly_jwtPrivateKey=myKey" you can use any key you want instead of "myKey" to set you jwtPrivateKey needed to encode/decode your information.
3) run this command : "nodemon" or " nodemon index" to get the back end server running.

and Everything should work without a problem you can use an application such as postman or insomnia to end requests to the server's url

available api routes : ----/api/users/ to execute CRUD operations for the users.
                       ----/api/genres/ to execute CRUD operations for the genres.
                       ----/api/movies/ to execute CRUD operations for the movies.
                       ----/api/auths/ to login and get your jwt auth token.
                    
