const jwt = require('jsonwebtoken')

require('dotenv').config() // this is to to read process.env variables from .env file


const verifyToken = (req, res, next) => {
    // this is a place where we verify the token
    // else we will block the API access

     const authHeader = req.headers['authorization'];

     // authHeader = `Bearer eyajhfajfbajhfdbjhasbdjasbjhasbjhasbdjabj'
     // authHeader = ['Bearer', 'eyajhfajfbajhfdbjhasbdjasbjhasbjhasbdjabj']
     //  token = 'eyajhfajfbajhfdbjhasbdjasbjhasbjhasbdjabj'

     const token = authHeader && authHeader.split(' ')[1];

     if (!token) return res.status(403).json({ errMsg: 'Access Denied, Unauthorized request'})


     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({errMsg: 'Invalid or Expired Token'})

        req.user = user // we store the encrypted data from token into req.user, to be used in the api logic
     
        next();
    }) 
}


module.exports = verifyToken; 