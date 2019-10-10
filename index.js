const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();
console.log(process.env.DB_CONNECT)
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true
}, () => {
    console.log('Connected to DB!');
});

// Middleware
app.use(express.json());


// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server up and running'));