function createEventOnClickForBookButton(data, dateOfInput) {
    for (let i = 0; i < document.querySelectorAll('.book').length; i++) {
        document.querySelectorAll('.book')[i].addEventListener('click', (e) => {
            let dateFormated = data[i].date
            const dataOfBookTrip = {
                departure: data[i].departure,
                arrival: data[i].arrival,
                date: `${dateOfInput}T${(dateFormated).replace(".", ":")}:00`,
                price: data[i].price,
            }
            console.log('data[i] : ', dataOfBookTrip);
            fetch('http://localhost:3000/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataOfBookTrip)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.result) {
                        document.querySelector('.second_title').innerHTML = data.message
                        var x = setTimeout(function () { document.querySelector('.second_title').innerHTML = 'Compare,book and enjoy cheap prices train tickets:your journey starts on Tickethack ' }, 2000);
                    }
                })


        })
    }
}

document.querySelector('#search').addEventListener('click', () => {
    let departure = document.querySelector('#departure').value
    let arrival = document.querySelector('#arrival').value
    let date = document.querySelector('#date').value


    if (departure.length !== 0 && arrival.length !== 0 && date.length !== 0) {
        fetch(`http://localhost:3000/trip/${departure}/${arrival}/${date}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.result) {
                    document.querySelector('#allTrip').innerHTML = ''
                    data.data.map(trip => {
                        document.querySelector('#allTrip').innerHTML += `
                    <div class="trip">
                        <p>${trip.departure}</p>
                        <p>${trip.arrival}</p>
                        <p>${(trip.date).replace(".", ":")}</p>
                        <p>${trip.price}</p>
                        <button class="book">Book</button>
                    </div>
                    `
                        console.log('data.data : ', data.data);
                        createEventOnClickForBookButton(data.data, date);
                        // document.querySelector('#allTrip').innerHTML += '<p id="message></p>'
                    })
                } else {
                    document.querySelector('#allTrip').innerHTML = ''
                    document.querySelector('#allTrip').innerHTML += `<img id = "image" src = "./images/train.png" />
                    <div class="ligne"></div>
        
                    <p id="message">It's time to book your futur trtip </p>`

                    document.querySelector('#image').src = 'images/notfound.png'
                    document.querySelector('#message').innerHTML = data.message
                }

            })
    } else {
        document.querySelector('#image').src = 'images/notfound.png'
        document.querySelector('#message').innerHTML = 'Enter all fields'
    }

})