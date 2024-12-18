
const dotenv = require("dotenv")
dotenv.config();

const express = require('express');
const routes = require('./src/routes');
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes)

const port = process.env.PORT || 4001 
app.listen(port, ()=>{
    console.log('Listening on port %s', port);
});
