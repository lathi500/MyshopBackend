const mongoose = require('mongoose');

const orderSchma = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    product: { type: mongoose.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number } // default keyword set default value of given field
})

module.exports = mongoose.model('Order', orderSchma);