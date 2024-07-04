import express from 'express';
import pool from './config/db.js';
import 'dotenv/config';

// Import required modules

// Create an Express app
const app = express();

const puerto = process.env.PORT || 3000;

// Enable JSON parsing for request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Read all booking
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

// Read a specific booking
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

// Create a new booking
app.post('/crud-reservas', async (req, res) => {

    const reserva = req.body;

    const sql = `INSERT INTO reservas SET ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [reserva]);
        connection.release();
        res.send(`
            <h1>reserva creada con id: ${rows.insertId}</h1>
        `);
    } catch (error) {
        res.sendStatus(500).send('Internal server error')
    }
});

// Update a specific booking
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

// Delete a specific booking
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

// Create a new user
app.post('/usuarios', async (req, res) => {

    const usuario = req.body;

    const sql = `INSERT INTO usuarios SET ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [usuario]);
        connection.release();
        res.send(`
            <h1>usuario creado con id: ${rows.insertId}</h1>
        `);
    } catch (error) {
        res.sendStatus(500).send('Internal server error')
    }
});

// Update a specific user
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

// Delete a specific user
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