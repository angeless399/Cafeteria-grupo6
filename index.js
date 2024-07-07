// Import required modules
import express from 'express';
import pool from './config/db.js';
import 'dotenv/config';
import cors from 'cors';
import bcryptjs from 'bcryptjs';

// Create an Express app
const app = express();

// Definir puerto
const puerto = process.env.PORT || 3000;

// Enable JSON parsing for request bodies
app.use(express.json({ type: "*/*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

// Obtener todas al reservas
app.get('/crud-reservas', async (req, res) => {
    const sql = `SELECT reservas.id, usuarios.usuario, usuarios.mail, usuarios.promociones,
                reservas.fecha, reservas.hora, reservas.personas, reservas.sucursal
                FROM reservas
                JOIN usuarios ON reservas.usuario = usuarios.id
                ORDER By reservas.fecha DESC`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql);
        connection.release();
        res.json(rows);

    } catch (error) {
        res.send(500).send('Internal server error')
    }

});

// Obtener una reserva especifica
app.get('/crud-reservas/:id', async (req, res) => {
    const id = req.params.id
    const sql = `SELECT reservas.id, usuarios.usuario, usuarios.mail, usuarios.promociones,
                reservas.fecha, reservas.hora, reservas.personas, reservas.sucursal
                FROM reservas
                JOIN usuarios ON reservas.usuario = usuarios.id
                WHERE reservas.id = ?`;


    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log("reservas al cliente --> ", rows)
        res.json(rows[0]);
    } catch (error) {
        res.send(500).send('Internal server error')
    }
});

// Crear nueva reserva
app.post('/crud-reservas', async (req, res) => {
    const reserva = req.body;
    const sql = `INSERT INTO reservas SET ?`;
    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [reserva]);
        connection.release();
        await res.json({
            mensaje: 'Reserva Registrada', //envia mensaje al front
        })
    } catch (error) {
        await res.json({
            mensaje: 'error al guardar reserva', //envia mensaje al front
        })
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
        res.send(`
            <h1>reserva id: ${id} actualizada</h1>
        `);
    } catch (error) {
        res.sendStatus(500).send('Internal server error')
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
        res.send(`
            <h1>reserva con id: ${id} borrada</h1>
        `);
    } catch (error) {
        res.sendStatus(500).send('Internal server error')
    }
});

// Registro de usuario
app.post('/registro.html', async (req, res) => {
    const usuario = req.body.usuario
    const mail = req.body.mail
    const contrasena = req.body.contrasena
    const promociones = req.body.promociones

    if (!usuario || !mail || !contrasena) {
        res.json({
            mensaje: "Los campos estan incompletos"
        })
    } else {
        const salt = await bcryptjs.genSalt(5)
        const hashPassword = await bcryptjs.hash(contrasena, salt)

        const nuevoUsuario = {
            usuario, mail, contrasena: hashPassword, promociones, tipo: 2
        }
        const sql = `INSERT INTO usuarios SET ?`;
        try {
            const connection = await pool.getConnection()
            const [rows] = await connection.query(sql, [nuevoUsuario]);
            connection.release();
            res.json({
                mensaje: 'Usuario Registrado', //envia mensaje al front
            })
        } catch (error) {
            res.json({
                mensaje: 'error al registrar usuario', //envia mensaje al front
            })
        }
    }
});

//login
// app.post('/login.html', autenticacion.login)

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
        res.send(`
            <h1>usuario con id: ${id} actualizado</h1>
        `);
    } catch (error) {
        res.sendStatus(500).send('Internal server error')
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