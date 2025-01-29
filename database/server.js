const express = require('express');
const cors = require('cors');

const app = express();

const { createClient } = require('@libsql/client');
require('dotenv').config(); // Para variables de entorno

// Configuración de Turso
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Conexión a la base de datos
// const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error('Error al conectar a la base de datos:', err.message);
//   } else {
//     console.log('Conectado a la base de datos SQLite.');
//   }
// });

// Ruta para validar existencia de usuario por email, id_number o phone_number ola

app.post('/validate-user', async (req, res) => {
  const { email, id_number, phone_number } = req.body;

  try {
    const result = await client.execute({
      sql: `SELECT * FROM owners WHERE email = ? OR id_number = ? OR phone_number = ?`,
      args: [email, id_number, phone_number]
    });

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Usuario ya registrado.' });
    }
    res.status(200).json({ message: 'Usuario disponible para registro.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar la base de datos.' });
  }
});

// Ruta para registrar nuevos propietarios
app.post('/register-owner', async (req, res) => {
  const { first_name, last_name, age, id_number, email, phone_number, password } = req.body;

  try {
    const result = await client.execute({
      sql: `
        INSERT INTO owners 
        (first_name, last_name, age, id_number, email, phone_number, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [first_name, last_name, age, id_number, email, phone_number, password]
    });

    res.status(201).json({
      message: 'Propietario registrado exitosamente.',
      id: result.lastInsertRowid.toString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el propietario.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.execute({
      sql: `SELECT * FROM owners WHERE email = ? AND password = ?`,
      args: [email, password]
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const owner = result.rows[0];
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      ownerId: owner.id.toString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar la base de datos.' });
  }
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});