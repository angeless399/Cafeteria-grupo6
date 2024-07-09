import jsonwebtoken from "jsonwebtoken";
import pool from '../config/db.js';
import dotenv from "dotenv";
// import 'dotenv/config';


dotenv.config();

function soloAdmin(req,res,next){
  const logueado = revisarCookie(req);
  if(logueado) return next();
  return res.redirect("/")
}

// function soloPublico(req,res,next){
//   const logueado = revisarCookie(req);
//   if(!logueado) return next();
//   return res.redirect("/admin")
// }

async function revisarCookie(req){

  try {
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log(decodificada)
    const mailUsuarioToken = decodificada.usuario
    console.log(mailUsuarioToken)

    const sql = 'SELECT * usuarios WHERE mail = ?';
      const connection = await pool.getConnection()
      const [rows] = await connection.query(sql, [mailUsuarioToken]);
      connection.release();
      console.log(rows[0])
      if (!rows[0]) {
          return false
      } else {
          return true
      }
  }
  catch{
    return false;
  }
}


export const metodos = {
  soloAdmin,
  // soloPublico,
}