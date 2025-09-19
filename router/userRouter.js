const express = require('express');
const router = express.Router();
const { v4: uuidv4 }= require('uuid');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../model/db')
const sq = db.sequelize

// This is user router

// URL PATH: /api/user/register
router.post('/register', async (req, res) => {

    const { username, password, confirm_password } = req.body; // meaning send as payload

    // const username = req.body.username;
    // const password = req.body.password;
    // const confirm_password = req.body.confirm_password;

    //apply field validation
    if (!username || !password || !confirm_password) 
        return res.status(422).json({ errMsg: 'Please fill in all the mandatory fields'})

    if (username.length < 5) 
        return res.status(422).json({ errMsg: 'Username must be at least 5 characters long'})

    if (username.includes('@'))
        return res.status(422).json({ errMsg: 'Username cannot contain @ symbol'})
    
    // password need match with confirm password
    if (password !== confirm_password) 
        return res.status(422).json({ errMsg: 'Password and confirm password is not matched'})

    let transaction;
    // insert data to database
    try {
        transaction = await sq.transaction();

        const isUserExist = await db.users.findOne({
            where: {
                // key: value <<- key must match with the column name in the table
                username: username
            }
        })

        if (isUserExist) 
            return res.status(422).json({errMsg: 'Username is already taken, please choose another username '})

        //hash the password before store into the database
        const hashedPassword = await bcrypt.hash(password, 10) 

        console.log( {
            username: username,
            password: hashedPassword
        })

        // store the new user into database
        await db.users.create({
            // key: value
            username: username,
            password: hashedPassword,
            role: 'superadmin'
        }, { transaction})

        await transaction.commit();

        return res.status(200).json({ 
            status: 'success',
            message: `User registration (${username}) is successful`
        })

    } catch(err) {
        if (transaction) await transaction.rollback();
        console.error(err)
        return res.status(500).json({ errMsg: 'Internal Server Error'})
    } 
})

// URL PATH: /api/user/login`
router.post('/login', async (req, res) => {
   const username = req.body.username;
   const password = req.body.password;

   if (!username || !password) 
    return res.status(422).json({ errMsg: 'Please fill username and password'})
   
   try {
        const isUserExist = await db.users.findOne({
            where: { 
                username: username
            }
        })



        console.log(isUserExist)
        // Commments: this is how you read JSON value

        // isUserExist.username = 'syurkansoleh'
        // isUserExist.password = '$2b$10$e0NRG7k1b8m7c4nYH6kzUu5r7F1OaX9xjE6FhQKqzj8Jf5y6y7z3C'

        // { 
        //     username: 'syukransoleh'
        //     password: '$2b$10$e0NRG7k1b8m7c4nYH6kzUu5r7F1OaX9xjE6FhQKqzj8Jf5y6y7z3C',
        //     role: 'superadmin',
        // }


        if (!isUserExist) return res.status(422).json({errMsg: 'Invalid username or password'})

        const isPasswordMatch = await bcrypt.compare(password, isUserExist.password)

        if (!isPasswordMatch) return res.status(422).json({errMsg: 'Invalid username or password'})

        //create a token, encrypt user data into token and send back to client
        const token = jwt.sign({
            username: isUserExist.username,
            role: isUserExist.role,
            text: 'testingggggggg'
        }, process.env.JWT_SECRET_KEY, { expiresIn: '15m'} )


        return res.status(200).json({
            status: 'success',
            message: 'User is successfully logged in',
            token
        })

    
    } catch(err) { 
        console.error(err)
        return res.status(500).json({ errMsg: 'Internal Server Error'})
        
    }
})


module.exports = router;