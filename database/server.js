const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Conexión a la base de datos
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Ruta para validar existencia de usuario por email, id_number o phone_number ola

app.post('/validate-user', (req, res) => {
  const { email, id_number, phone_number } = req.body;

  const query = `SELECT * FROM owners WHERE email = ? OR id_number = ? OR phone_number = ?;`;

  db.get(query, [email, id_number, phone_number], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
    if (row) {
      return res.status(400).json({ message: 'Usuario ya registrado.' });
    }
    res.status(200).json({ message: 'Usuario disponible para registro.' });
  });
});

// Ruta para registrar nuevos propietarios
app.post('/register-owner', (req, res) => {
  const { first_name, last_name, age, id_number, email, phone_number, password } = req.body;

  // Validar datos
  if (!first_name || !last_name || !age || !id_number || !email || !phone_number || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  // Insertar propietario en la base de datos
  const query = `
    INSERT INTO owners (first_name, last_name, age, id_number, email, phone_number, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [first_name, last_name, age, id_number, email, phone_number, password], function (err) {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).json({ error: 'Error al registrar el propietario.' });
    }

    // Devolver el ID del propietario recién creado
    res.status(201).json({ message: 'Propietario registrado exitosamente.', id: this.lastID });
  });
});

// Ruta para validar login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const query = `SELECT * FROM owners WHERE email = ? AND password = ?;`;

  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }

    if (row) {
      res.status(200).json({ message: 'Inicio de sesión exitoso.', ownerId: row.id });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
  });
});

// Ruta para registrar propiedades
app.post('/register-property', (req, res) => {
  const {
    address, property_name, property_type, owner_id,
    apartment_number, RNT, check_in_date, check_out_date
  } = req.body;

  if (!address || !property_name || !property_type || !owner_id || !check_in_date || !check_out_date) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados.' });
  }

  const status = getStatus(check_in_date, check_out_date);

  const query = `
    INSERT INTO properties (address, property_name, property_type, owner_id, apartment_number, RNT, check_in_date, check_out_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  db.run(query, [address, property_name, property_type, owner_id, apartment_number, RNT, check_in_date, check_out_date, status],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al insertar la propiedad en la base de datos.' });
      }
      res.status(201).json({ message: 'Propiedad registrada exitosamente.', propertyId: this.lastID });
    });
});

// Ruta para obtener todas las propiedades
app.get('/properties', (req, res) => {
  const query = `SELECT * FROM properties;`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las propiedades.' });
    }
    res.status(200).json(rows);
  });
});

// Función para determinar el estado de la propiedad según las fechas
function getStatus(check_in_date, check_out_date) {
  const currentDate = new Date();
  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);

  if (currentDate < checkIn) {
    return 'reserved';
  } else if (currentDate >= checkIn && currentDate <= checkOut) {
    return 'occupied';
  } else {
    return 'avaible';
  }
}

// Editar una propiedad
app.put('/properties/:id', (req, res) => {
  const propertyId = req.params.id;
  const { address, property_name, property_type, status, apartment_number, RNT, check_in_date, check_out_date } = req.body;

  const query = `
    UPDATE properties 
    SET address = ?, property_name = ?, property_type = ?, status = ?, apartment_number = ?, RNT = ?, check_in_date = ?, check_out_date = ?
    WHERE id = ?;
  `;

  db.run(query, [address, property_name, property_type, status, apartment_number, RNT, check_in_date, check_out_date, propertyId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar la propiedad.' });
    }

    res.status(200).json({ message: 'Propiedad actualizada exitosamente.' });
  });
});

// Eliminar una propiedad
app.delete('/properties/:id', (req, res) => {
  const propertyId = req.params.id;
  const query = `DELETE FROM properties WHERE id = ?`;
  console.log("Hola mundo");

  db.run(query, [propertyId], function (err) {
    if (err) {
      console.error("Error al eliminar la propiedad:", err);
      return res.status(500).json({ error: 'Error al eliminar la propiedad.' });
    }

    if (this.changes === 0) {
      // Si no se eliminó ninguna fila (puede ser que no haya una propiedad con ese ID)
      return res.status(404).json({ error: 'Propiedad no encontrada.' });
    }

    res.status(200).json({ message: 'Propiedad eliminada exitosamente.' });
  });
});


// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});