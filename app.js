const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// require('dotenv').config();

const userRoutes = require('./api/routes/user');
const adminRoutes = require('./api/routes/admin');
const offerRoutes = require('./api/routes/offer');
const applicationRoutes=require('./api/routes/application');
const faqRoutes = require('./api/routes/faq');

// if(process.env.NODE_ENV != 'production'){
//     dotenv.config({path: '.env'});
// }

mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>console.log("Connected to Database Successfully"));

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Origin',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method==='OPTIONS'){
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'  
        );

        return res.status(200).json({});
    }
    next();
});

app.use('/application', applicationRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use ('/offer', offerRoutes);
app.use('/faq', faqRoutes);

app.use((req, res, next)=> {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {

    res.status(error.status || 500);
    res.json({
        message: error.message
    });

});
module.exports = app;
