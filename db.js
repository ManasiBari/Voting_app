const mongoose = require('mongoose')
require ('dotenv').config();

const mongoURL = "mongodb+srv://node_hello:helloworld@cluster0.8dfs2ao.mongodb.net/"


//Delete the MongoDB connection URL
mongoose.connect('mongodb://localhost:27017/voting', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//Get the default connection
//Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;


//Define Event listener for database connection
db.on('connected', () =>{
    console.log('Connected to MongoDB server');
});

db.on('error', (err) =>{
    console.log('MongoDB connection error:', err);
});

db.on('disconnected', () =>{
    console.log('disConnected to MongoDB server');
});


//exports the database connection
module.exports = db;