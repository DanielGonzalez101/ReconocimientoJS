DROP TABLE IF EXISTS owners;

DROP TABLE IF EXISTS properties;

CREATE TABLE owners(
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    id_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE properties (
    id INTEGER PRIMARY KEY,
    -- ID único de la propiedad
    address TEXT NOT NULL,
    -- Dirección de la propiedad
    property_name TEXT NOT NULL,
    -- Nombre de la propiedad
    property_type TEXT NOT NULL CHECK (property_type IN ('unit', 'house')),
    -- Tipo de propiedad
    owner_id INTEGER NOT NULL,
    -- Dueño de la propiedad (relacionado con la tabla users)
    status TEXT NOT NULL CHECK (status IN ('reserved', 'occupied', 'avaible')),
    -- Estado de la propiedad
    apartment_number TEXT,
    -- Número de apartamento (opcional y solo aplicable a apartamentos)
    RNT TEXT,
    -- Registro Nacional de Turismo (opcional)
    check_in_date DATE,
    -- Fecha de entrada
    check_out_date DATE,
    -- Fecha de salida
    FOREIGN KEY (owner_id) REFERENCES owners (id) -- Relación con la tabla users
);

