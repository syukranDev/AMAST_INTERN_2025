const express = require('express');
const router = express.Router();
const { v4: uuidv4 }= require('uuid');

const db = require('../model/db')
const sq = db.sequelize

// api/product/new
router.post('/new', async (req, res) => {
    console.log(req.body)
    let { name, description, origin_country, quantity, price, expiry_date} = req.body;

    if (!name || !description || !origin_country || !quantity || !price || !expiry_date) {
        return res.status(422).send({ errMsg: 'Please fill in all required fields' });
    }

    let transaction;

    try {
        transaction =await sq.transaction()
        await db.products.create({
            id: uuidv4(),
            name: name,
            description: description, 
            origin_country,
            quantity, 
            price,
            status: 'active',
            expiry_date,
        }, { transaction })
    } catch(err) {
        if (transaction) await transaction.rollback();
        console.error(err)
        return res.status(500).send({ errMsg: 'Internal Server Error'});
    }

    return res.status(200).send({ status: 'succcess', 'message': 'New product created successfully' });

})

// in AMAST, HTTP CODES -> we 200 (OK), 422 (client doesnt give correct info), 500 (server error)
// api/product/details/:id
router.get('/details/:id', async (req, res) => {
    let productId = req.params.id;

    let data;

    try {
        // check if the product with give ID is exist in database
        let isProductExist = await db.products.findOne({
            where: {
                id: productId
            }
        })

        // if not exist, return error message
        if (!isProductExist) return res.status(422).send({errMsg: `Product (${productId}) does not exist`})

        data = await db.products.findOne({
            where: { id: productId }
        })

    } catch(err) {
        console.error(err)
        return res.status(500).send({ errMsg: 'Internal Server Error'});
    }

    return res.status(200).send({ status: 'success', data})
})



module.exports = router;