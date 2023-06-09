const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        default:'admin'
    },

})
const User = mongoose.model('user', UserSchema);
User.createIndexes()
module.exports = User