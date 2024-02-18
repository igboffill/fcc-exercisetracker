require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const exerciseSchema = new mongoose.Schema({
    description: { type: String, required: true},
    duration: { type: Number, required: true},
    date: { type: Date, default: Date.now},
}); 

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    exercises: {type: [exerciseSchema], default:[]}
}); 



const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', userSchema);

module.exports =  {User, Exercise}
