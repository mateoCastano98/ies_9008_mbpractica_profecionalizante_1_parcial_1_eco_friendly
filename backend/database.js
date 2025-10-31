// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Conectar a (o crear) la base de datos
const db = new sqlite3.Database('./eco_friendly.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos eco_friendly.db.');
});

// Crear tablas
db.serialize(() => {
    // Tabla de Usuarios (para Login y Registro)
    db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Error al crear tabla Usuarios:", err.message);
    });

    // Tabla de Asesores
    db.run(`CREATE TABLE IF NOT EXISTS Asesores (
        id_asesor INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_asesor TEXT NOT NULL,
        especialidad TEXT
    )`, (err) => {
        if (err) console.error("Error al crear tabla Asesores:", err.message);
    });

    // Tabla de Turnos
    db.run(`CREATE TABLE IF NOT EXISTS Turnos (
        id_turno INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        id_asesor INTEGER,
        fecha TIMESTAMP NOT NULL,
        motivo TEXT,
        estado TEXT DEFAULT 'Pendiente',
        FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario),
        FOREIGN KEY (id_asesor) REFERENCES Asesores (id_asesor)
    )`, (err) => {
        if (err) console.error("Error al crear tabla Turnos:", err.message);
    });

    // Tabla de Habilitaciones
    db.run(`CREATE TABLE IF NOT EXISTS Habilitaciones (
        id_habilitacion INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        nombre_documento TEXT NOT NULL,
        fecha_vencimiento DATE,
        estado TEXT DEFAULT 'Vigente',
        FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario)
    )`, (err) => {
        if (err) console.error("Error al crear tabla Habilitaciones:", err.message);
    });

    // --- Insertar datos de fantasía (solo para probar) ---
    
    // Contraseña de ejemplo es "123456"
    bcrypt.hash('123456', 10, (err, hash) => {
        if(err) return;
        const sql_insert_user = `INSERT OR IGNORE INTO Usuarios (nombre, email, password_hash) VALUES (?, ?, ?)`;
        db.run(sql_insert_user, ['Usuario de Prueba', 'test@eco.com', hash], (err) => {
            if (err) console.error("Error al insertar usuario de prueba:", err.message);
        });
    });

});

module.exports = db;