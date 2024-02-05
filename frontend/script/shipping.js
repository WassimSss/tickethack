fetch('http://localhost:3000/shipping')
    .then(response => response.json())
    .then(data => {
        console.log(data);


    })


function createEventOnClickForDeleteButton() {

    for (let i = 0; i < document.querySelectorAll('.deleteButton').length; i++) {
        document.querySelectorAll('.deleteButton')[i].addEventListener('click', (e) => {
            const id = document.querySelectorAll('.deleteButton')[i].id
            fetch(`http://localhost:3000/cart/delete/${id}`, {
                method: 'DELETE',

            })
            e.target.parentNode.remove()
        })
    }
}

fetch('http://localhost:3000/shipping/')
    .then(response => response.json())
    .then(allShipping => {
        console.log(allShipping);
        if (allShipping.result) {
            document.querySelector('#cart').innerHTML = ''
            allShipping.data.map(element => {
                document.querySelector('#cart').innerHTML += `
                    <div class="row">
                        <p>${element.departure}>${element.arrival}</p>
                        <p>${(element.date).replace('.', ':')}</p>
                        <p>${element.price}€</p>
                        <p>Departure ${element.remaining}</p>
                    </div>
                    `;
            })
            document.querySelector('#cart').innerHTML += `
            <p>Enjoy your travel with tickethack</p>
            `
            createEventOnClickForDeleteButton()
        } else {
            document.querySelector('#booking').innerHTML = allShipping.message
        }

    })