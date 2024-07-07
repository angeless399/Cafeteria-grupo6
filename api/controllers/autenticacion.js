async function login(req, res){

}

async function registro(req, res){
    console.log(req.body)
    const usuario = req.body.usuario
    const mail = req.body.mail
    const contrasena = req.body.contrasena
    const promociones = req.body.promociones
    const tipo = req.body.tipo

    if(!usuario || !mail || !contrasena){
        res.json({
            mensaje : "Los campos estan incompletos"
        })
        // res.status(400).send({status:"Error", message:"Los campos estan incompletos"})
    }

}

export const metodos = {
    login,
    registro
}