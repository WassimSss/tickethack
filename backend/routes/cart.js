var express = require('express');
var router = express.Router();
const Cart = require('../models/carts')
const Shipping = require('../models/shippings')
const moment = require('moment')

router.get('/', (req, res) => {
  const today = moment().toDate()

  Cart.find({
    date: {
      $gte: today
    }
  }).then(data => {
    if (data.length > 0) {

      const newArray = data.map(trip => {

        return {
          _id: trip._id,
          departure: trip.departure,
          arrival: trip.arrival,
          date: moment(trip.date, 'fr'),
          price: trip.price
        }
      })

      const newArraySorted = newArray.sort((a, b) => { return a.date - b.date });

      for (const element of newArraySorted) {
        element.date = element.date.format("MMMM Do YYYY, HH:mm")
      }

      res.json({ result: true, data: newArraySorted })
    } else {
      res.json({ result: false, message: 'No booking yet' })
    }
  })

})

router.post('/add', (req, res) => {

  const { departure, arrival, date, price } = req.body;

  try {

    Cart.find({ departure: departure, arrival: arrival, date: date, price: price })
      .then(data => {
        if (data.length > 0) {
          res.json({ result: false, message: 'The trip is already on the cart' })
        } else {
          const formatedDate = moment(date)

          const newCart = new Cart({
            departure: departure,
            arrival: arrival,
            date: formatedDate,
            price: price
          })

          newCart.save().then(data => {
            res.json({ result: true, data: data })
          })
        }

      })
  } catch (error) {
    console.error(error)
  }

})

router.delete('/delete/:id', (req, res) => {
  console.log('ok');
  Cart.deleteOne({ _id: req.params.id }).then(data => {
    res.json({ result: true })
  })
})

router.post('/addInShipping', async (req, res) => {
  try {
    const today = moment().toDate();

    const cartItems = await Cart.find({
      date: {
        $gte: today
      }
    });

    const shippingPromises = cartItems.map(async (element) => {
      const newShipping = new Shipping({
        departure: element.departure,
        arrival: element.arrival,
        date: moment(element.date).toDate(),
        price: element.price
      });

      await newShipping.save();
    });

    await Promise.all(shippingPromises);

    await Cart.deleteMany();

    res.json({ result: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

module.exports = router;