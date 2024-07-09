//cerrar sesion
document.querySelector('#btn-logout').addEventListener('click', () => {
    //borra la cookie que contiene el token, utilizando una fecha anterior a la de creacion
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01'

    //redirecciona al index.html
    document.location.href = "/"
})

const obtenerDatos = async() => {
    try {
        const respuesta = await fetch('/admin');
        const datos = await respuesta.json();
        // console.log(datos)

        const contenedor = document.querySelector('#contReservas');
        let reservas = '';

        datos.forEach(reserva => {
            reservas += `
                    <div class="reserva">
                       <p>Usuario:  ${reserva.usuario}</p>
                       <p> Email: ${reserva.mail}</p>
                       <p> Fecha: ${reserva.fecha}</p>
                       <p>Hora:  ${reserva.hora}</p>
                       <p>Cant de Personas: ${reserva.personas}</p>
                       <p>Sucursal:  ${reserva.sucursal}</p>
                    </div>
                    `
        });

        contenedor.innerHTML = reservas


    } catch (error) {
        console.log(error)
    }
}

obtenerDatos()


// fetch('/admin.html')
//             .then(response => response.json())
//             // .then(data => console.log(data))
//             .then(datos => mostrarReservas(datos))

//             const mostrarReservas = (datos) => {
//                 const contenedor = document.querySelector('#contReservas')
//                 let reservas = ''

//                 datos.forEach(reserva => {
//                     reservas += `
//                     <div class="reserva">
//                        <p>Usuario:  ${reserva.usuario}</p>
//                        <p> Email: ${reserva.mail}</p>
//                        <p> Fecha: ${reserva.fecha}</p>
//                        <p>Hora:  ${reserva.hora}</p>
//                        <p>Cant de Personas: ${reserva.personas}</p>
//                        <p>Sucursal:  ${reserva.sucursal}</p>
//                     </div>
//                     `
//                 });

//                 contenedor.innerHTML = reservas
//             }