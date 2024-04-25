const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    userName:{
        type : String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique:true,

    },
    password:{
        type: String,
        require: true
    },
    photo:{
        type: String,
        require: true
    },

    following:[{

      type: ObjectId,
      ref:'User'
    }],
    followers:[{
        type: ObjectId,
        ref:'User'
    }]
    
})

module.exports = mongoose.model('User',userSchema);