var express = require('express');
var router = express.Router();
let Trip = require('../models/trips');
const moment = require('moment');

router.get('/:departure/:arrival/:date', function (req, res) {
    let { departure, arrival, date } = req.params;

    if (departure != '' && arrival != '' && date != '') {

        let startDate = moment.parseZone(date).utc(true).toDate()
        const today = moment.parseZone().utc(true).startOf('day').toDate();
        const endDate = moment(startDate).endOf("day").toDate();

        if (moment(startDate).diff(today) <= 0) {
            startDate = moment.parseZone().utc(true).toDate();
        }


        Trip.find({
            departure: departure,
            arrival: arrival,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).then(data => {
            if (data.length > 0) {
                let newArray = data.map(trip => {
                    return {
                        departure: trip.departure,
                        arrival: trip.arrival,
                        date: moment.parseZone(trip.date).utc(true).format("HH.mm"),
                        price: trip.price
                    }
                })

                const newArraySorted = newArray.sort((a, b) => { return parseFloat(a.date) - parseFloat(b.date) });

                res.json({ result: true, data: newArraySorted })
            } else {
                res.json({ result: false, message: 'No trip found' })
            }
        })
    }
})

module.exports = router;
