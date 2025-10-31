document.addEventListener('DOMContentLoaded', function() {
    
    // ==============================================
    // Código para el Carrusel de Testimonios (Existente)
    // ==============================================
    const slidesContainer = document.querySelector('.testimonial-slides-container');
    
    // Verificación para que el script no falle en páginas sin carrusel
    if (slidesContainer) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');
        let currentSlide = 0;
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i !== index) {
                    slide.classList.remove('active');
                } else {
                    slide.classList.add('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', prevSlide);
            nextArrow.addEventListener('click', nextSlide);
        }

        if (totalSlides > 0) {
            showSlide(currentSlide);
        }
    } // Fin del if (slidesContainer)

    // ==============================================
    // Código para el Menú Hamburguesa (Existente)
    // ==============================================
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburgerMenu.classList.contains('active')) {
                    hamburgerMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // ==============================================
    // NUEVO: Lógica de Calculadora (Req: Lógica Compleja JS)
    // ==============================================
    const calculadoraForm = document.getElementById('calculadora-form');
    if (calculadoraForm) {
        calculadoraForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenimos el envío del formulario
            
            // Factores de emisión (de fantasía, puedes ajustarlos)
            const FACTOR_ELECTRICIDAD = 0.45; // kg CO2e/kWh
            const FACTOR_GAS = 2.05;          // kg CO2e/m³
            const FACTOR_COMBUSTIBLE = 2.31;  // kg CO2e/Litro

            // Valores mensuales
            const kwh = parseFloat(document.getElementById('electricidad').value) || 0;
            const gas = parseFloat(document.getElementById('gas').value) || 0;
            const combustible = parseFloat(document.getElementById('combustible').value) || 0;

            // Cálculo anual
            const co2_electricidad = (kwh * FACTOR_ELECTRICIDAD) * 12;
            const co2_gas = (gas * FACTOR_GAS) * 12;
            const co2_combustible = (combustible * FACTOR_COMBUSTIBLE) * 12;

            const totalCO2_kg = co2_electricidad + co2_gas + co2_combustible;
            const totalCO2_toneladas = (totalCO2_kg / 1000).toFixed(2); // Convertir a toneladas

            // Mostrar resultado
            document.getElementById('total-co2').textContent = `${totalCO2_toneladas} Toneladas CO2e`;
            document.getElementById('resultado-calculadora').style.display = 'block';
        });
    }

    // ==============================================
    // NUEVO: Lógica de Formularios (Req: Validación y Envío)
    // ==============================================

    // --- Validación y Envío de Registro ---
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Previene el envío normal del formulario
            const msgDiv = registroForm.querySelector('#form-message'); // Busca el div de mensaje DENTRO de este form
            if (!msgDiv) return; // Si no hay div de mensaje, salimos
            msgDiv.style.display = 'none';

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validación de Cliente (Req: Validación JS)
            if (!nombre || !email || !password) {
                mostrarMensaje(msgDiv, 'Todos los campos son obligatorios.', 'error');
                return;
            }
            if (password.length < 6) {
                mostrarMensaje(msgDiv, 'La contraseña debe tener al menos 6 caracteres.', 'error');
                return;
            }

            // Envío a Backend (Req: Envío)
            try {
                // El servidor corre en localhost:3000
                const response = await fetch('http://localhost:3000/api/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password })
                });

                const data = await response.json();

                if (data.success) {
                    mostrarMensaje(msgDiv, '¡Registro exitoso! Redirigiendo al login...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                } else {
                    mostrarMensaje(msgDiv, data.message, 'error');
                }
            } catch (error) {
                mostrarMensaje(msgDiv, 'Error de conexión con el servidor.', 'error');
            }
        });
    }

    // --- Validación y Envío de Login ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Previene el envío normal del formulario
            const msgDiv = loginForm.querySelector('#form-message'); // Busca el div de mensaje DENTRO de este form
            if (!msgDiv) return;
            msgDiv.style.display = 'none';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validación de Cliente (Req: Validación JS)
            if (!email || !password) {
                mostrarMensaje(msgDiv, 'Por favor, completa ambos campos.', 'error');
                return;
            }
            
            // Envío a Backend (Req: Envío)
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    mostrarMensaje(msgDiv, 'Login exitoso. Redirigiendo al panel...', 'success');
                    // Redirigimos al panel estático
                    setTimeout(() => {
                        window.location.href = '/panel-cliente.html';
                    }, 1500);
                } else {
                    mostrarMensaje(msgDiv, data.message, 'error');
                }
            } catch (error) {
                mostrarMensaje(msgDiv, 'Error de conexión con el servidor.', 'error');
            }
        });
    }

    // Función helper para mostrar mensajes
    function mostrarMensaje(msgDiv, texto, tipo = 'error') {
        if (msgDiv) {
            msgDiv.textContent = texto;
            if (tipo === 'error') {
                msgDiv.className = 'form-message-error';
            } else {
                msgDiv.className = 'form-message-success';
            }
            msgDiv.style.display = 'block';
        }
    }

    // ==============================================
    // NUEVO: Lógica del Panel de Cliente (Simulación)
    // ==============================================
    const logoutButton = document.getElementById('logout-button');
    if(logoutButton) {
        // Por ahora, solo simula el logout
        logoutButton.addEventListener('click', () => {
            alert('Cerrando sesión (Simulación Frontend)...');
            window.location.href = 'login.html';
        });
    }

});