const formulario = document.forms['form'];

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    // console.log("se envio el formulario")

    let fecha = formulario.fecha.value
    let hora = formulario.hora.value
    let personas = formulario.cant.value
    let sucursal = formulario.local.value
    // let nombre = formulario.nombre.value
    // let mail = formulario.email.value
    // let promos = formulario.promos.value

    let paqDatos = { fecha: fecha, hora: hora, personas: personas, sucursal: sucursal, usuario: 1 }

    let paqDatosJson = JSON.stringify(paqDatos);
    // console.log(paqDatosJson)
    
    //manda los datos al backend
    fetch('http://localhost:3000/crud-reservas', {
        method: 'Post',
        body: paqDatosJson
    })
        .then(res => res.json()) // convierte la respuesta del backend en json, equivalente a json.parse()
        .then(resp => alert(resp.mensaje)) // muesta lo recibido mensaje recibido del backend
        .catch(error => alert(`errro ${error}`)) // alerta por error
    document.querySelector('#form').reset(); //limpia el formulario
})