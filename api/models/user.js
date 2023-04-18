const mongoose = require('mongoose');

const userSchma = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: { type: String, require: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    password: { type: String, require: true } // default keyword set default value of given field
})

module.exports = mongoose.model('User', userSchma);