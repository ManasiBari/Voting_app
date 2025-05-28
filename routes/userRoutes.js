const express = require ("express");
const router = express.Router();
const User = require("../models/user");
const {jwtAuthMiddleware, generateToken} = require('./../jwt');



router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the person data

    // Create a new user document using the Mongoose model
    const newUser = new User(data);

    // Save the new user to the database
    const response = await newUser.save();
    console.log("Data saved");

    const payload ={
      id: response.id,
      username: response.username
    }

    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is : token")


    res.status(200).json({response: response, token: token});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login Route
router.post('/login', async(req,res)=>{
  try{
    //Extract aadharCardNumber and password from request body

    const{aadharCardNumber, password }= req.body;

    //find the user by username
    const user= await User.findOne({aadharCardNumber: aadharCardNumber});

    //If user does not exist or password does not match return error
    if(!user || !(await user. comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'});
    }

    // genrate token

    const payload = {
      id : user.id,
    
    }
    const token= generateToken(payload);
    
    //return token as response
    res.json({token})

  }
  catch(err){
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'});


  }
});


//Profile route

router.get('/profile', jwtAuthMiddleware, async (req, res)=>{
  try{
    const userData = req.user;
    // console.log("User Data: ", userData);

    const userID = userData.id;
    const user = await User.findBy(userID);

    res.status(200).json({user});

  }
  catch(err){
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'});

  }
})



// router.put("/profile/password", async (req, res) => {
//   try {
//     const userId = req.user; //Extract the id from the token
//     const { currentPassword, newPassword} = req.body //Extract current and new passwords from request body


// //find the user by userID
//     const user = await User.findBy(userId);

//      //If password does not exist or match return error
//     if(!user || !(await user. comparePassword(currentPassword))){
//       return res.status(401).json({error: 'Invalid username or password'});
//     }
// //Update tje user's password

// user.password = newPassword;
// await user.save();

//     console.log("Password updated");
//     res.status(200).json({message: "Password Updated"});
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });



router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from token
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    user.password = newPassword;
    await user.save();

    console.log("Password updated");
    res.status(200).json({ message: "Password Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
