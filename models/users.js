const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema ({
    firstname: {
        type: String, 
        required: true,
    },
    lastname: {
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    tabs: {
        type: String,
        unique: true,
    }
});

UserSchema.plugin(passportLocalMongoose); //creates username and password by passing in form to passportlocal plugin

module.exports = mongoose.model('User', UserSchema);
