const mongoose = require('mongoose');

const shippingsSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    price: Number
})

const Shipping = mongoose.model('shippings', shippingsSchema);

module.exports = Shipping;