// ============================================
// JavaScript para el Dashboard
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    let estadisticas = {
        vistasPerfil: 1245,
        consultasMes: 24,
        calificacion: 4.8,
        trabajosCompletados: 12
    };

    // Elementos del DOM
    const userBtn = document.querySelector('.user-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const inquiryButtons = document.querySelectorAll('.inquiry-actions .btn');

    // Inicializar dropdown de usuario
    function inicializarDropdownUsuario() {
        userBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });

        // Prevenir cierre al hacer clic dentro del dropdown
        dropdownMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Inicializar sidebar
    function inicializarSidebar() {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                // Si es un enlace interno, actualizar estado activo
                if (this.getAttribute('href').startsWith('/')) {
                    e.preventDefault();

                    // Remover activo de todos
                    sidebarLinks.forEach(l => l.classList.remove('active'));

                    // Agregar activo al clickeado
                    this.classList.add('active');

                    // Simular cambio de sección
                    cambiarSeccion(this.getAttribute('href'));
                }
            });
        });
    }

    // Simular cambio de sección
    function cambiarSeccion(seccion) {
        const seccionMap = {
            '/dashboard': 'Dashboard',
            '/profesional/perfil': 'Mi Perfil',
            '/profesional/trabajos': 'Mis Trabajos',
            '/profesional/mensajes': 'Mensajes',
            '/profesional/resenas': 'Reseñas',
            '/profesional/estadisticas': 'Estadísticas',
            '/profesional/suscripcion': 'Suscripción'
        };

        const nombreSeccion = seccionMap[seccion] || 'Dashboard';

        // Actualizar título de la página
        document.title = `${nombreSeccion} - Provecino`;

        // Mostrar notificación
        mostrarNotificacion(`Cambiando a: ${nombreSeccion}`, 'info');

        // Aquí iría la lógica real para cargar contenido dinámico
        console.log(`Cargando sección: ${seccion}`);
    }

    // Inicializar botones de contacto
    function inicializarBotonesContacto() {
        inquiryButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const inquiryItem = this.closest('.inquiry-item');
                const cliente = inquiryItem.querySelector('h4').textContent;
                const descripcion = inquiryItem.querySelector('p').textContent;

                // Simular contacto por WhatsApp
                const mensaje = encodeURIComponent(`Hola ${cliente}, vi tu consulta sobre "${descripcion}". ¿En qué puedo ayudarte?`);
                const whatsappUrl = `https://wa.me/5492231234567?text=${mensaje}`;

                // Abrir WhatsApp en nueva pestaña
                window.open(whatsappUrl, '_blank');

                // Marcar como contactado
                this.innerHTML = '<i class="fas fa-check"></i> Contactado';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                this.disabled = true;
            });
        });
    }

    // Actualizar estadísticas en tiempo real
    function inicializarEstadisticas() {
        // Simular actualización periódica de estadísticas
        setInterval(() => {
            // Incrementar vistas de perfil aleatoriamente
            estadisticas.vistasPerfil += Math.floor(Math.random() * 10);

            // Actualizar en el DOM
            const vistasElement = document.querySelector('.stat-card:nth-child(1) h3');
            if (vistasElement) {
                vistasElement.textContent = estadisticas.vistasPerfil.toLocaleString();
            }
        }, 30000); // Cada 30 segundos
    }

    // Mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${tipo}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = 'var(--radius)';
        notification.style.boxShadow = 'var(--shadow-lg)';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideInRight 0.3s ease';
        notification.textContent = mensaje;

        switch (tipo) {
            case 'success':
                notification.style.backgroundColor = 'var(--success)';
                notification.style.color = 'white';
                break;
            case 'error':
                notification.style.backgroundColor = 'var(--error)';
                notification.style.color = 'white';
                break;
            case 'warning':
                notification.style.backgroundColor = 'var(--warning)';
                notification.style.color = 'white';
                break;
            default:
                notification.style.backgroundColor = 'var(--primary)';
                notification.style.color = 'white';
        }

        document.body.appendChild(notification);

        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Simular carga de datos iniciales
    function cargarDatosIniciales() {
        // Aquí simularías una llamada a la API
        setTimeout(() => {
            // Datos de ejemplo
            const datosEjemplo = {
                nombre: 'Juan Pérez',
                oficio: 'Electricista',
                rating: 4.8,
                consultasPendientes: 3,
                proximoTrabajo: 'Mañana, 10:00 AM'
            };

            // Actualizar UI con datos
            actualizarUI(datosEjemplo);

            // Mostrar notificación de bienvenida
            mostrarNotificacion(`¡Bienvenido al dashboard, ${datosEjemplo.nombre}!`, 'success');
        }, 1000);
    }

    // Actualizar UI con datos
    function actualizarUI(datos) {
        // Actualizar nombre en header si existe
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement && datos.nombre) {
            userNameElement.textContent = datos.nombre;
        }

        // Actualizar título de bienvenida
        const welcomeTitle = document.querySelector('.dashboard-header-content h1');
        if (welcomeTitle && datos.nombre) {
            welcomeTitle.textContent = `¡Bienvenido, ${datos.nombre.split(' ')[0]}!`;
        }
    }

    // Inicializar todo
    function inicializarTodo() {
        inicializarDropdownUsuario();
        inicializarSidebar();
        inicializarBotonesContacto();
        inicializarEstadisticas();
        cargarDatosIniciales();

        // Agregar animaciones CSS dinámicamente
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .btn-success {
                background-color: var(--success);
                color: white;
            }
            
            .btn-success:hover {
                background-color: var(--success-dark);
            }
        `;
        document.head.appendChild(style);

        console.log('Dashboard inicializado correctamente');
    }

    // Ejecutar inicialización
    inicializarTodo();
});