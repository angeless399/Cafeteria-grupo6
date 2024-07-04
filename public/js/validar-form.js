

const btn= document.querySelector("#btn");

btn.addEventListener("click", (event) => {
   
    let fecha = document.querySelector("#fecha").value.length;
    const hora = document.querySelector("#hora").value.length;
    const sucursal = document.querySelector("#sucursal").value.length;
    const cant_personas = document.querySelector("#cant").value.length;
    const nombre = document.querySelector("#nombre").value.length;
    const email = document.querySelector("#email").value.length;
    const promos = document.querySelector("#promos").value;
    
    if((fecha*hora*sucursal*cant_personas*nombre*email)==0){
        event.preventDefault();
        document.querySelector(".resp-form").innerHTML = 'Falta completar información';
    }

    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(!(regexEmail.test(document.querySelector("#email").value))){
        event.preventDefault();
        document.querySelector(".resp-form-correo").innerHTML = 'este correo no es valido';  
    }
});
