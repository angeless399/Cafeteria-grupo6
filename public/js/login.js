formLogin = document.forms['form-login']
console.log(formLogin)
formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log('estoy')

    let email = formLogin.email.value
    let pass = formLogin.pass.value


    objUsuario = {mail: email, contrasena: pass}

    jsonUsuario = JSON.stringify(objUsuario)

    console.log(jsonUsuario)

    const res = await fetch('http://localhost:3000/login.html',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonUsuario
    })
        .then(res => res.json()) // convierte la respuesta del backend en json, equivalente a json.parse()
        .then(resp => {
                alert(resp.mensaje);
                if(resp.redirect){
                window.location.href = resp.redirect;
                }
        }) // muesta el mensaje recibido del backend y redirecciono al login.html para que inicie sesion
        .catch(error => alert(`error ${error}`)) // alerta por error
       
       
})