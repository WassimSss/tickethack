// function createEventOnClickForDeleteButton(data) {
//     let total = 0

//     for (let i = 0; i < data.length; i++) {
//         total += data[i].price
//     }

//     console.log('total avant : ', total);

//     for (let i = 0; i < document.querySelectorAll('.deleteButton').length; i++) {
//         if (document.querySelectorAll('.deleteButton')[i] !== undefined) {
//             document.querySelectorAll('.deleteButton')[i].addEventListener('click', (e) => {
//                 const id = document.querySelectorAll('.deleteButton')[i].id
//                 const price = document.querySelectorAll('.deleteButton')[i].classList[1]
//                 fetch(`http://localhost:3000/cart/delete/${id}`, {
//                     method: 'DELETE',
//                 })

//                 total -= parseInt(price)
//                 document.querySelector('#total').innerHTML = `Total : ${total}€`
//                 e.target.parentNode.remove()
//                 createEventOnClickForDeleteButton(data)

//                 if (document.querySelectorAll('.deleteButton').length === 0) {
//                     document.querySelector('.div-parent').innerHTML = 'No booking yet'
//                 }
//             })
//         }
//     }
// }
function createEventOnClickForDeleteButton(data) {
    let total = 0

    for (let i = 0; i < data.length; i++) {
        total += data[i].price
    }

    document.removeEventListener('click', handleDeleteButtonClick);

    document.addEventListener('click', handleDeleteButtonClick);

    function handleDeleteButtonClick(event) {
        if (event.target.classList.contains('deleteButton')) {
            const id = event.target.id;
            const price = parseInt(event.target.classList[1]);

            fetch(`http://localhost:3000/cart/delete/${id}`, {
                method: 'DELETE',
            });

            total -= price;
            document.querySelector('#total').innerHTML = `Total : ${total}€`;
            event.target.parentNode.remove();

            if (document.querySelectorAll('.deleteButton').length === 0) {
                document.querySelector('.div-parent').innerHTML = 'No booking yet';
            }
        }
    }

}
fetch('http://localhost:3000/cart/')
    .then(response => response.json())
    .then(allCart => {
        console.log(allCart);
        if (allCart.result) {
            document.querySelector('#cart').innerHTML = ''
            let total = 0
            allCart.data.map(element => {
                document.querySelector('#cart').innerHTML += `
                <div class="row">
                    <p>${element.departure} > ${element.arrival}</p>
                    <p>${(element.date).replace('.', ':')}</p>
                    <p>${element.price}€</p>
                    <button class="deleteButton ${element.price}"} id=${element._id}>X</button>
                </div>
                `;
                total += element.price
            })
            document.querySelector('#cart').innerHTML += `
            <div class="total">
            <p id="total"></p>
            <button id="purchase">Purchase</button>
        </div>
            `
            document.querySelector('#total').innerHTML = `Total : ${total}€`
            createEventOnClickForDeleteButton(allCart.data)

            document.getElementById('purchase').addEventListener('click', () => {
                // enlever tout au clique
                fetch('http://localhost:3000/cart/addInShipping', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.result) {

                        document.querySelector('.div-parent').innerHTML = 'Thanks for the purchase'
                    }
                })
        } else {
            document.querySelector('.div-parent').innerHTML = allCart.message
        }

    })