// Import required modules
import express from 'express';
import pool from './config/db.js';
import 'dotenv/config';
import cors from 'cors';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

// dotenv.config();

// Create an Express app
const app = express();

// Definir puerto
const puerto = process.env.PORT || 3000;

// Enable JSON parsing for request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

// Obtener todas al reservas
app.get('/crud-reservas', async (req, res) => {
    const sql = `SELECT reservas.id, reservas.fecha, reservas.hora, reservas.personas,
                usuarios.usuario, usuarios.mail, usuarios.promociones,
                sucursales.sucursal,
                tipousuarios.tipo
                FROM reservas
                JOIN usuarios ON reservas.usuario = usuarios.id
                JOIN sucursales ON reservas.sucursal = sucursales.id
                JOIN tipousuarios ON usuarios.tipo = tipousuarios.id
                ORDER By reservas.fecha asc`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql);
        connection.release();
        await res.json(rows);

    } catch (error) {
        res.send(500).send('Internal server error')
    }

});

// Obtener una reserva especifica
app.get('/crud-reservas/:id', async (req, res) => {
    const id = req.params.id
    const sql = `SELECT reservas.id, reservas.fecha, reservas.hora, reservas.personas,
                usuarios.usuario, usuarios.mail, usuarios.promociones,
                sucursales.sucursal,
                tipousuarios.tipo
                FROM reservas
                JOIN usuarios ON reservas.usuario = usuarios.id
                JOIN sucursales ON reservas.sucursal = sucursales.id
                JOIN tipousuarios ON usuarios.tipo = tipousuarios.id
                WHERE reservas.id = ?`;
    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log("reservas al cliente --> ", rows);

        if (rows.length === 0) {
            //si no encontro ningun registro
            res.status(404).send(`No existe reserva con el numero ${id}`);
        } else {
            //si encontro registro
            res.json(rows[0]);
        }

    } catch (error) {
        res.status(500).send('Internal server error')
    }
});

// Crear nueva reserva
app.post('/crud-reservas', async (req, res) => {
    const reserva = req.body;
    const sql = `INSERT INTO reservas SET ?`;
    console.log("reserva", reserva);
    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [reserva]);
        connection.release();

        res.status(200).json({
            mensaje: 'Reserva Registrada', //envia mensaje al front
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'error al guardar reserva', //envia mensaje al front
        });
    }
});

// Actualizar una reserva
app.put('/crud-reservas/:id', async (req, res) => {
    const id = req.params.id;
    const reserva = req.body;

    const sql = `UPDATE reservas SET ? WHERE id = ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [reserva, id]);
        connection.release();
        console.log(rows)

        if (rows.affectedRows === 0) {
            //si no encuentra ningun registro
            res.status(404).json({
                mensaje: 'No se encontro la resrva solicitada', //envia mensaje al front
            });
        } else {
            //si se actualizo correctamente
            res.status(200).json({
                mensaje: 'Reserva actualizada', //envia mensaje al front
            });}

        } catch (error) {
            console.error(error);
            res.status(500).json({
                mensaje: 'error al actualizar reserva', //envia mensaje al front
            });
        }

    });

// Borrar una reserva
app.delete('/crud-reservas/:id', async (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM reservas WHERE id = ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log(rows)

        if (rows.affectedRows === 0) {
            //si no se encontro ningun registro con el req.params.id
            res.status(404).json({
                mensaje: 'no se encontro la reserva solicitada'
            });
        } else {
            //si se elimino correctamente
            res.status(200).json({
                mensaje: 'reserva borrada exitosamente'
            });
        }
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Internal server error'
        })
    }
});

// Registro de usuario
app.post('/registro.html', async (req, res) => {
    const usuario = req.body.usuario
    const mail = req.body.mail
    const contrasena = req.body.contrasena
    const promociones = req.body.promociones

    console.log({usuario});

    if (!usuario || !mail || !contrasena) {
        res.json({
            mensaje: "Los campos estan incompletos"
        })
    } else {
        // se encripta la contraseña 
        const salt = await bcryptjs.genSalt(5)
        const hashPassword = await bcryptjs.hash(contrasena, salt)

        const nuevoUsuario = {
            usuario, mail, contrasena: hashPassword, promociones, tipo: 2
        }
        console.log(nuevoUsuario);
        const sql = `INSERT INTO usuarios SET ?`;
        try {
            const connection = await pool.getConnection()
            const [rows] = await connection.query(sql, [nuevoUsuario]);
            connection.release();
            res.json({
                mensaje: 'Usuario Registrado', //envia mensaje al front
                redirect: './login.html'
            })
        } catch (error) {
            res.json({
                mensaje: 'error al registrar usuario', //envia mensaje al front
            })
        }
    }
});

//login
app.post('/login.html', async (req, res) => {
    console.log(req.body)
    const mail = req.body.mail
    const contrasena = req.body.contrasena
    if (!mail || !contrasena) {
        res.json({
            mensaje: "Los campos estan incompletos"
        })
    } else {
        const sql = `SELECT * FROM usuarios WHERE mail = ?`;
        try {
            const connection = await pool.getConnection()
            const [rows] = await connection.query(sql, [mail]);
            connection.release();
            if (!rows[0]) {
                res.json({
                    mensaje: "El usuario no existe"
                })
            } else {

                console.log('El usuario EXISTE', rows[0].contrasena);
                //el usuario existe entonces
                //comparo la pass que recibo del front con la guardada en la db
                const loginCorrecto = await bcryptjs.compare(contrasena, rows[0].contrasena);
                console.log(loginCorrecto);
                if (!loginCorrecto) {
                    res.json({
                        mensaje: "Usuario o contraseña incorrecta"
                    })
                } else {

                    //se crea el token
                    const token = jsonwebtoken.sign({ usuario: mail }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

                    console.log("token: ", token)

                    //se configura la cookie
                    const cookieOption = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000),
                        path: "/"
                    }

                    //se envia la cookie al usuario
                    res.cookie("jwt", token, cookieOption);
                    res.send({ mensaje: "Usuario Loggeado", redirect: "/admin.html" })
                }

            }
        }
        catch (error) {
            res.Status(500).send('Internal server error')
        }
    }
})

// Actualizar usuario
app.put('/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    const usuario = req.body;

    const sql = `UPDATE usuarios SET ? WHERE id = ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [usuario, id]);
        connection.release();
        console.log(rows)
        if (rows.affectedRows === 0) {
            //si no encontro ningun registro
            res.status(404).json({
                mensaje:'No existe el usuario requerido', //envia mensaje al front
            });
        }else{
        res.status(200).json({
           mensaje: `el usuario seleccionado fue actualizado`
        });}
    } catch (error) {
        res.Status(500).send('Internal server error')
    }

});

// Borrar usuario
app.delete('/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM usuarios WHERE id = ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log(rows)
        res.send(`
            <h1>usuario con id: ${id} borrado</h1>
        `);
    } catch (error) {
        res.sendStatus(500).send('Internal server error')
    }
});

// Start the server
app.listen(puerto, () => {
    console.log('Server started on port 3000');
});