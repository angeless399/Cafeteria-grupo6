import jsonwebtoken from "jsonwebtoken";
import pool from '../config/db.js';
import 'dotenv/config';



const soloAdmin = async(req,res,next) => {
  const logueado = await revisarCookie(req);
  console.log("logueado", logueado)
  if(logueado==1){
    return next()}
    else{
    return res.redirect("/")
  }

    // if(logueado){
  //   return next()}
  //   else{
  //   return res.redirect("/")
  // }
}


// function soloPublico(req,res,next){
//   const logueado = revisarCookie(req);
//   if(!logueado) return next();
//   return res.redirect("/admin")
// }

async function revisarCookie(req){

  try {
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    console.log("cookieJWT: ", cookieJWT)
    const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log("DECODIFICADA: ",decodificada)
    const mailUsuarioToken = decodificada.usuario
    console.log("mailUsuarioToken: ",mailUsuarioToken)

    const sql = 'SELECT * FROM usuarios WHERE mail = ?';
      const connection = await pool.getConnection()
      const [rows] = await connection.query(sql, [mailUsuarioToken]);
      connection.release();
      console.log("Consulta db: ",rows[0])
      // if (!rows[0]) {
      //     return false
      // } else {
      //     return true
      // }
      if (!rows[0]) {
        return 0
    } else{
        return rows[0].tipo
    }
  }
  catch{
    return false;
  }
}


export const metodos = {
  soloAdmin
}

// export const metodos = {
//   soloAdmin,
//   soloPublico,
// }