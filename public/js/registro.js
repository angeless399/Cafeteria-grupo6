formRegistro = document.forms['form-registro']
console.log(formRegistro);

formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();
    let nombre = formRegistro.nombre.value
    let email = formRegistro.email.value
    let pass = formRegistro.pass.value
    let promos = formRegistro.promos.value

    objUsuario = {usuario: nombre, mail: email, contrasena: pass, promociones: promos, tipo: 2 }

    jsonUsuario = JSON.stringify(objUsuario)

    const res = await fetch('http://localhost:3000/registro.html', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonUsuario
    })
        .then(res => res.json()) // convierte la respuesta del backend en json, equivalente a json.parse()
        .then(resp => alert(resp.mensaje)) // muesta lo recibido mensaje recibido del backend
        document.querySelector('#form-registro').reset(); //limpia el formulario
})