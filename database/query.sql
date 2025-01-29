DROP TABLE IF EXISTS owners;

DROP TABLE IF EXISTS properties;

-- Tabla owners (se mantiene igual)
CREATE TABLE owners(
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    id_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE, -- Clave única para usar como referencia
    phone_number TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Tabla properties (modificamos la relación)
CREATE TABLE properties (
    id INTEGER PRIMARY KEY,
    address TEXT NOT NULL,
    property_name TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('unit', 'house')),
    owner_email TEXT NOT NULL, -- Usamos el email como referencia
    status TEXT NOT NULL CHECK (status IN ('reserved', 'occupied', 'available')), -- Corregido "avaible" → "available"
    apartment_number TEXT,
    RNT TEXT,
    check_in_date DATE,
    check_out_date DATE,
    FOREIGN KEY (owner_email) REFERENCES owners(email) -- Relación por email
);