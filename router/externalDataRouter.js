const express = require('express');
const router = express.Router();
const { v4: uuidv4 }= require('uuid');
const axios = require('axios');

const db = require('../model/db')
const sq = db.sequelize

// api/external_data/fetch
// sample 3rd party API: https://v2.jokeapi.dev/joke/Any?type=single
// install axios -> npm install axios
router.get('/fetch', async (req, res) => {
    let thirdPartyAPI = `https://v2.jokeapi.dev/joke/Any?type=single`

    try {
        const response = await axios.get(thirdPartyAPI)

        let data = JSON.stringify(response.data)

        await db.webhook_3rd_party.create({ // create - insert new SINGLE record
            id: uuidv4(),
            source_url: thirdPartyAPI,
            data
            // data:data
            
        })

         return res.status(200).send({
            status:'Successfully fetching 3rd party API and saved into DATABASE',
            data: response.data
         })
        
    } catch(err) {
        console.error(err)
        return res.status(500).send({ errMsg: 'Internal Server Error'});
    } 
})


module.exports = router;