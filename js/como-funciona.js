// ============================================
// JavaScript para la página Cómo funciona
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    let tabActual = 'vecinos';

    // Elementos del DOM
    const tabBtns = document.querySelectorAll('.como-tab-btn');
    const tabContents = document.querySelectorAll('.como-tab-contenido');
    const faqQuestions = document.querySelectorAll('.como-faq-pregunta');

    // Inicializar tabs
    function inicializarTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');

                // Actualizar botones
                tabBtns.forEach(b => b.classList.remove('activo'));
                this.classList.add('activo');

                // Actualizar contenido
                tabContents.forEach(content => {
                    content.classList.remove('activo');
                    if (content.id === tabId + 'Tab') {
                        content.classList.add('activo');
                        tabActual = tabId;

                        // Guardar preferencia en localStorage
                        localStorage.setItem('comoFuncionaTab', tabId);
                    }
                });

                // Animación suave al cambiar tab
                document.querySelector(`#${tabId}Tab`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

        // Restaurar tab anterior si existe
        const tabGuardada = localStorage.getItem('comoFuncionaTab');
        if (tabGuardada) {
            const tabBtn = document.querySelector(`.como-tab-btn[data-tab="${tabGuardada}"]`);
            if (tabBtn) {
                tabBtn.click();
            }
        }
    }

    // Inicializar FAQ accordion
    function inicializarFAQ() {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function () {
                const answer = this.nextElementSibling;
                const icon = this.querySelector('i');

                // Cerrar otras preguntas
                if (!this.classList.contains('activo')) {
                    faqQuestions.forEach(q => {
                        q.classList.remove('activo');
                        q.nextElementSibling.classList.remove('activo');
                    });
                }

                // Alternar estado actual
                this.classList.toggle('activo');
                answer.classList.toggle('activo');

                // Rotar ícono
                icon.style.transform = this.classList.contains('activo') ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        });

        // Abrir primera pregunta por defecto
        if (faqQuestions.length > 0) {
            faqQuestions[0].classList.add('activo');
            faqQuestions[0].nextElementSibling.classList.add('activo');
            faqQuestions[0].querySelector('i').style.transform = 'rotate(180deg)';
        }
    }

    // Animación de números para planes (si los hubiera)
    function animarNumeros() {
        const counters = document.querySelectorAll('.como-contador');

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            // Observador para animar cuando sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    // Efecto parallax para hero
    function inicializarParallax() {
        const hero = document.querySelector('.como-hero');

        if (hero) {
            window.addEventListener('scroll', function () {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;

                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    // Tooltips para iconos
    function inicializarTooltips() {
        const tooltipElements = document.querySelectorAll('.como-tooltip');

        tooltipElements.forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip');

            if (tooltipText) {
                element.addEventListener('mouseenter', function (e) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'como-tooltip-text';
                    tooltip.textContent = tooltipText;
                    tooltip.style.position = 'absolute';
                    tooltip.style.backgroundColor = 'var(--dark)';
                    tooltip.style.color = 'var(--white)';
                    tooltip.style.padding = '0.5rem 1rem';
                    tooltip.style.borderRadius = 'var(--radius)';
                    tooltip.style.fontSize = '0.875rem';
                    tooltip.style.zIndex = '1000';
                    tooltip.style.whiteSpace = 'nowrap';

                    document.body.appendChild(tooltip);

                    const rect = element.getBoundingClientRect();
                    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                    tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';

                    element._tooltip = tooltip;
                });

                element.addEventListener('mouseleave', function () {
                    if (element._tooltip) {
                        element._tooltip.remove();
                        delete element._tooltip;
                    }
                });
            }
        });
    }

    // Inicializar todas las funcionalidades
    function inicializarTodo() {
        inicializarTabs();
        inicializarFAQ();
        animarNumeros();
        inicializarParallax();
        inicializarTooltips();

        // Añadir clase al body para estilos específicos
        document.body.classList.add('pagina-como-funciona');

        console.log('Página "Cómo funciona" inicializada correctamente');
    }

    // Ejecutar inicialización
    inicializarTodo();
});

// Funciones globales para botones de planes
window.seleccionarPlan = function (planType) {
    alert(`¡Excelente! Has seleccionado el plan ${planType}. Serás redirigido al formulario de registro.`);
    window.location.href = `/registro?plan=${encodeURIComponent(planType)}`;
};

// Función para abrir FAQ específica
window.abrirFAQ = function (faqId) {
    const pregunta = document.getElementById(`faq-${faqId}`);
    if (pregunta) {
        pregunta.click();
        pregunta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};