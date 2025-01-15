fetch('pages/header.html')
        .then(Response => Response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.error('Error while downloading header: ', error));

fetch('pages/footer.html')
    .then(Response => Response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Error while downloading footer: ', error));