const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

//Define the Person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required:true

    },
    mobile:{
        type: String,
        reuired: true
    },
    email:{
        type: String
        // required:true,
        // unique:true
    },
    address:{
        type: String,
        required:true
    },
   aadharCardNumber:{
    type: Number,
    required: true,
    unique:true
   },
    password:{
            required:true,
            type:String
        }, 
        role:{
            type: String,
            enum:['voter', 'admin'],
            default: 'voter'

        },
        isVoted:{
          type: Boolean,
          default:false  
        }
 
});

userSchema.pre('save', async function(next){
    const user = this;

    if(!user.isModified('password')) return next();

    try{
        //hash password generation
        const salt = await bcrypt.genSalt(10);

        //hash password
        const hashedPassword = await bcrypt.hash(user.password, salt);

        //Override the plain password with the hashed one
        user.password = hashedPassword;
        next();
    }

    catch(err)
    {
        return next(err);

    }
    
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        //use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    }catch(err){
        throw err;
    }
}




const User =mongoose.model('User', userSchema);
module.exports = User;
