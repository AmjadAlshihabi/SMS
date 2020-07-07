const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const products = require('./api/routes/products');
const orders = require('./api/routes/orders');
const users = require('./api/routes/users');

mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb+srv://alshihabi_amjad:'
    + process.env.MONGO_ATLAS_PW +
    '@store-management-system-3c30l.mongodb.net/Store-Management-System?retryWrites=true&w=majority',
    {
        // useMongoClient: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

// mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => { 
    console.log('DB connected');
})

// console loging
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
// Preventing CORS errors (cross orgin resources sharing),
// giving access for other servers to use the API
app.use((req, res, next) => {
    //to be edit later on when the domain is ready. 
    //substitute * with the website url.
    res.header('Access-Control_Allow-Origin', '*');
    res.header(
        'Access-Control_Allow-Headers', 'Origin, X-requested-width, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// a middleware for handling different incoming routes 
app.use('/products', products);
app.use('/orders', orders);
app.use('/users', users);

// throws error if the incoming request does not make it through the previous routes 
app.use((req, res, next) => {
    const err = Error('Not found');
    err.status = 404;
    next(err);
})
 // catches errors thrown anywhere in the system.
app.use((err, req, res, next) => { 
    res.status(err.status || 500).json({
        err: {
            message: err.message 
        }
    })
})

module.exports = app;