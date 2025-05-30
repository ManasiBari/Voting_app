const jwt = require ('jsonwebtoken');


const jwtAuthMiddleware = (req, res, next)=>{

    //first check request headers has authorization or not

    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'Token Not Found'});


//Extract the jwt token from the request headers
    const token= req.headers.authorization.split(' ')[1];
    // console.log("TOken ->" + token);
    if(!token) return res.status(401).json({error : 'Unauthorized'});

    try{
        //verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attach user information to the request object
        req.user = decoded
        next();

    }
    catch(err){
        console.error(err);
        res.status(401).json({error: 'Invalid token'});

    }
}

//Function to genrate JWT token
const generateToken = (userData)=>{
    //Geneate a new Jwt token using user data
    return jwt.sign(userData, process.env.JWT_SECRET);
    
}



module.exports = {jwtAuthMiddleware, generateToken}
















