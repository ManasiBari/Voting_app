const express = require("express")
const app = express();
require('dotenv').config();
const db = require('./db')


const bodyParser = require("body-parser");
app.use(bodyParser.json());

const PORT = process.env.PORT = 3000;



//Import the roter files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const {jwtAuthMiddleware} = require('./jwt');

//use the routers
app.use('/user', userRoutes);
app.use('/candidate', jwtAuthMiddleware, candidateRoutes);





app.listen(PORT, () => {
  console.log("Listening on port 3000");
});




// const express = require("express");
// const app = express();
// require('dotenv').config();
// const db = require('./db');

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 3000; // ✅ Use fallback, not assignment

// // Import the router files
// const userRoutes = require('./routes/userRoutes');
// const candidateRoutes = require('./routes/candidateRoutes');

// const { jwtAuthMiddleware } = require('./jwt'); // ✅ Correct spelling

// // Use the routers
// app.use('/user', userRoutes);
// app.use('/candidate', jwtAuthMiddleware, candidateRoutes); // ✅ Correct usage

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });


