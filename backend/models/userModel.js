const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        // unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        minlength : [6, 'Password must be at least 6 characters']
    },
    age : {
        type : Number,
        required : true
    },
    height : {
        type : Number,
        required : true
    },
    weight : {
        type : Number,
        required : true
    },
    sex : {
        type : String,
        required : true
    },
    isVerified: {
    type: Boolean,
    default: false,
  },
  emailToken: String,
  tokenExpiration: Date,


  resetPasswordToken: String,
  resetPasswordExpires: Date,

  isProfileComplete: {
  type: Boolean,
  default: false,
},

 streak: {
    type: Number,
    default: 0,
  },

  lastWorkoutDate: {
  type: Date,
}

});


// encrypting password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // if password is not modified
  const salt = await bcrypt.genSalt(); // generate salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model('user', userSchema);
module.exports = User;