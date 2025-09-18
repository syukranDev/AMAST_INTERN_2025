const express = require('express');
const app = express();

let productRouter = require('./router/productRouter.js')
let externalDataRouter = require('./router/externalDataRouter.js')

app.use(express.json()); // for client to send payload in JSON format

app.use('/api/product', productRouter);
app.use('/api/external_data', externalDataRouter);


app.get('/api/welcome_onboard/:name',(req, res) => {
    // let name = req.query.name;        // URL query parameter ?name
    // let age = req.query.age           // URL query parameter ?age
    // let company = req.query.workplace // URL query parameter ?workplace

    let name = req.params.name
    let age = req.query.age

    return res.json({
        status: 'success',
        message: `Welcome to onboard, ${name}! You are ${age} years old.`
    });
})


//test


app.listen(3003, () =>{
    console.log('Server is running on port 3003');
})

