document.querySelector('#btn-logout').addEventListener('click', ()=>{
    //borra la cookie que contiene el token, utilizando una fecha anterior a la de creacion
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01'

    //redirecciona al index.html
    document.location.href = "/"
})