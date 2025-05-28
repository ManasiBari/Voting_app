// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");

// const Candidate = require("../models/candidate");
// const { jwtAuthMiddleware, generateToken } = require("../jwt");

// const checkAdminRole = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     return user.role === "admin";
//   } catch (err) {
//     return false;
//   }
// };

// //post route to add a candidate
// router.post("/", async (req, res) => {
//   try {
//     if (!await checkAdminRole(req.user.id))
//       return res.status(403).json({ message: "user does not have admin role" });

//     const data = req.body; // Assuming the request body contains the candidate data

//     // Create a new candidate document using the Mongoose model
//     const newCandidate = new Candidate(data);

//     // Save the new user to the database
//     const response = await newCandidate.save();
//     console.log("Data saved");

//     // res.status(200).json({ response: response, token: token });
//     res.status(200).json({ response: response, token: token });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.put("/:candidateID", async (req, res) => {
//   try {
//     if (!checkAdminRole(req.user.id))
//       return res.status(403).json({ message: "user does not have admin role" });

//     const candidateID = req.params.candidateID; //Extract the id from the Url parameter
//     const updatedCandidateData = req.body; // Updated data for the person

//     const response = await Candidate.findByIdAndUpdate(
//       candidateID,
//       updatedCandidateData,
//       {
//         new: true, //Return the updated document
//         runValidators: true, //Run Mongoose validation
//       }
//     );

//     if (!response) {
//       return res.status(404).json({ error: "Candidate not found" });
//     }

//     console.log("Candidate data updated");
//     res.status(200).json(response);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });



// router.delete("/:candidateID", async (req, res) => {
//   try {
//     if (!checkAdminRole(req.user.id))
//       return res.status(403).json({ message: "user does not have admin role" });

//     const candidateID = req.params.candidateID; //Extract the id from the Url parameter
//     // const updatedCandidateData = req.body; // Updated data for the person

//     const response = await Candidate.findByIdAndDelete(candidateID);

//     if (!response) {
//       return res.status(403).json({ error: "Candidate not found" });
//     }

//     console.log("Candidate data deleted");
//     res.status(200).json(response);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;





const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const User = require("../models/user");
const { jwtAuthMiddleware } = require("../jwt");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "admin";
  } catch (err) {
    return false;
  }
};

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have admin role" });

    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();

    console.log("Candidate data saved");
    res.status(200).json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have admin role" });

    const response = await Candidate.findByIdAndUpdate(
      req.params.candidateID,
      req.body,
      { new: true, runValidators: true }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have admin role" });

    const response = await Candidate.findByIdAndDelete(req.params.candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate data deleted");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//let's start voting

router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{
// no admin can vote
//user can only vote one time

candidateID = req.params.candidateID
userId = req.user.id;
try{
  //find the candidate document with the specified candidateID

  const candidate = await Candidate.findById(candidateID);
  if(!candidate){
    return res.status(404).json({message: 'candidate not found'});
  }

  const user = await User.findById(userId);
  if(!user){
        return res.status(404).json({message: 'user not found'});
  }
  if(user.isVoted){
            return res.status(400).json({message: 'You have already voted'});
  }
  if(user.role == 'admin'){
     return res.status(403).json({message: 'admin is not allowed'})
  }
//update the Candidate document to record the vote
  candidate.votes.push({user: userId})
  candidate.voteCount++;
  await candidate.save();

  //update the user document
  user.isVoted = true
  await user.save();

  res.status(200).json({message: 'Vote recodrded Succesfully'})

} catch(err){
  console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
 

  }

} )




//vote count

router.get('/vote/count', async (req, res) =>{
  try{
    //find all candidates and sort them by votecount in descending order

    const candidate = await Candidate.find().sort({voteCount: 'desc'});

    // Map the candidate to only return their name and voteCount
    const voteRecord = candidate.map((data)=>{
      return{
        party: data.party,
        count: data.voteCount
      }
    });
    return res.status(200).json(voteRecord)


  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
 
  }
})



module.exports = router;
