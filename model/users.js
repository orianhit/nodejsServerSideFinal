// Orian Dabod 308337062
// Lital Kraft 314806647

// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    id: {
        type: Number,
        index: true,
        required: true,
    },
    first_name: {type:String, required: true},
    last_name: {type:String, required: true},
    birthday: {type:Date, required: true},
}, { _id: false });

const Users = mongoose.model('Users', usersSchema);

module.exports = {
    'usersSchema': usersSchema,
    'Users': Users,
}