var express = require('express');
var router = express.Router();
const Shipping = require('../models/shippings');
const moment = require('moment')

router.get('/', function (req, res) {
  const start = moment();

  Shipping.find({
    date: {
      $gte: start
    }
  }).then(data => {
    if (data.length > 0) {
      const dataFormated = data.map(element => {
        const end = moment(element.date);
        return { departure: element.departure, arrival: element.arrival, date: moment(element.date, 'fr'), price: element.price, remaining: end.from(start) }
      })

      const newArraySorted = dataFormated.sort((a, b) => { return a.date - b.date });

      for (const element of newArraySorted) {
        element.date = element.date.format("MMMM Do YYYY, HH:mm")
      }
      
      res.json({ result: true, data: newArraySorted })
    } else {
      res.json({ result: false, message: 'No booking yet.' })
    }
  })
});

module.exports = router;