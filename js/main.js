document.addEventListener('DOMContentLoaded', function() {
    const slidesContainer = document.querySelector('.testimonial-slides-container');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        // Desactivar todos los slides y ocultarlos con la transición
        slides.forEach((slide, i) => {
            if (i !== index) { // Si no es el slide que se va a mostrar
                slide.classList.remove('active');
                // No necesitamos display: none aquí inmediatamente, visibility: hidden ya los oculta
            }
        });

        // Activar el slide actual
        slides[index].classList.add('active');
    }

    // Function to go to the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Function to go to the previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Event listeners for arrows
    if (prevArrow) {
        prevArrow.addEventListener('click', prevSlide);
    }
    if (nextArrow) {
        nextArrow.addEventListener('click', nextSlide);
    }

    // Inicializa el carrusel mostrando el primer slide
    if (totalSlides > 0) {
        showSlide(currentSlide);
    }
});