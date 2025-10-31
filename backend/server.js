    // backend/server.js
    const express = require('express');
    const path = require('path');
    const db = require('./database.js');
    const bcrypt = require('bcryptjs');
    const cors = require('cors');

    const app = express();
    const PORT = 3000;

    // Middleware
    app.use(cors()); // Permite peticiones (importante si el frontend y backend corren en puertos diferentes)
    app.use(express.json()); // Para parsear JSON en el body
    app.use(express.urlencoded({ extended: true })); // Para parsear formularios

    // --- SERVIR ARCHIVOS ESTÁTICOS (Tu Frontend) ---
    // Le decimos a Express que sirva todos los archivos desde la carpeta raíz del proyecto (un nivel arriba de 'backend')
    // Así, cuando vayas a localhost:3000, cargará tu index.html
    app.use(express.static(path.join(__dirname, '..')));

    // --- RUTAS DE LA API (Backend) ---

    // REQUISITO: formulario con validación y envío (INSERT)
    app.post('/api/registro', async (req, res) => {
        const { nombre, email, password } = req.body;

        // Validación de servidor
        if (!nombre || !email || !password) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        try {
            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // Insertar en la BD (Cumple requisito INSERT)
            const sql = `INSERT INTO Usuarios (nombre, email, password_hash) VALUES (?, ?, ?)`;
            db.run(sql, [nombre, email, password_hash], function(err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ success: false, message: 'Error al registrar el usuario. El email quizás ya existe.' });
                }
                res.status(201).json({ success: true, message: 'Usuario registrado con éxito.', userId: this.lastID });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor.' });
        }
    });

    // REQUISITO: mínimo 1 consulta a base de datos (SELECT)
    app.post('/api/login', (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios.' });
        }

        // Consultar la BD (Cumple requisito SELECT)
        const sql = `SELECT * FROM Usuarios WHERE email = ?`;
        db.get(sql, [email], async (err, usuario) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error en el servidor.' });
            }
            if (!usuario) {
                return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos.' });
            }

            // Comparar contraseña
            const isMatch = await bcrypt.compare(password, usuario.password_hash);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos.' });
            }

            // (Iteración 3: Aquí crearíamos el token/sesión y redirigiríamos)
            res.status(200).json({ success: true, message: 'Login exitoso (Backend).' });
        });
    });


    // --- SERVIR PÁGINAS HTML (Para que las rutas funcionen al navegar) ---
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));
    app.get('/servicios.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'servicios.html')));
    app.get('/nosotros.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'nosotros.html')));
    app.get('/noticias.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'noticias.html')));
    app.get('/contacto.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'contacto.html')));
    app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'login.html')));
    app.get('/registro.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'registro.html')));
    app.get('/calculadora.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'calculadora.html')));
    app.get('/panel-cliente.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'panel-cliente.html')));


    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        // Ejecutamos el script de la BD al iniciar para crear las tablas
        require('./database.js');
    });