const express = require("express");
const app = express();
const morgan = require("morgan");

const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://BhavinT:' + process.env.Mongo_Atlas_PS + '@cluster0.pt58e.mongodb.net/?retryWrites=true&w=majority' );

//Body parser used to manage request body data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev')); //morgan log an next request
app.use(express.static('Images/sss/'));
//prevent corse error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*')   //Give access premission to al origin, * descirbe all. we can give specific origin name.
    res.header('Access-Control-Allow-Header',
            "Origin, X-Requested-With, Content-Type, Accept, Authorization" //  all this headers can accepted for an incomming request ,can use star(*) for all header
    );//define which client of header want to give access

    if(req.method === "OPTIONS")
    {
        res.header('Access-Control-Allow-Methods',  'PUT, GET, POST, DELETE, PATCH'); //Giving access whcih method as request can server accept
        return res.status(200).json({});
    }
    next();    
})


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error); 
})

app.use(( error, req, res, next ) => {
    res.status( error.status || 500 ).json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;