const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//Dotenv
dotenv.config();


//Mongodb configuration
connectDB();


//Rest Object
const app = express();


//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


//Routes
app.use('/api/v1/auth', require("./routes/userRoutes"))
app.use('/api/v1/post', require("./routes/postRoutes"));


//Port 
const PORT = process.env.PORT || 8080;
//listen
app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`);
})
