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
         required: function () {
      return this.authProvider === 'local';
    },
        minlength : [6, 'Password must be at least 6 characters']
    },

  authProvider: {
  type: String,
  required: true,
  default: 'local', 
},
    age: Number,
    height: Number,
    weight: Number,
    sex: String,

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
},
longestStreak: { type: Number, default: 0 },     // optional - for profile stats


 // Push notifications
  pushSubscribed: { type: Boolean, default: false },
  pushSubscription: { type: Object, default: null } // stores endpoint + keys

});



// encrypting password
userSchema.pre('save', async function (next) {
  if (this.authProvider !== 'local') {
    return next();
  }

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model('user', userSchema);
module.exports = User;