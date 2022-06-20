
# MoviesExplorer REST API

Backend для Movies Explorer на Node.js (Express).
Allows to create an account to access the front-end part of the service and add entries to the database.
Designed to work with a third-party movie database from the API: https://api.nomoreparties.co/beatfilm-movies
## Technologies
Server based on Node.js and Express library. 3001 port. Stored in MongoDB. Secure routes require validation with the Bearer token in the header's Authorization parameter.

## How to run

  At first, run Node.JS server:
  
      npm run dev
  
  Then, run MongoDB daemon:
  
      mongod
## Routes

  - POST "/signup" - public. Takes user info for create new account (email, password and name).
  	
  - POST "/signin" - public. Takes and validate user info and returns JWT-token.
  
  - GET "/users/me" - private. Returns information about user (email and name).
  	
  - PATCH "/users/me" - private. Takes and set new user information (email and name).
  	
  - GET "/movies" - private. Returns all saved by current user movies.
	
  - POST "/movies" - private. Takes moive data for create name entry in database.

  - DELETE "/movies/_id" - private. Delete entry from database by ID.

