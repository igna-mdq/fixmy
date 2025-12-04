// ============================================
// JavaScript para Panel de Administración
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    let usuarios = [];
    let usuariosFiltrados = [];

    // Elementos del DOM
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const filterOficio = document.getElementById('filterOficio');
    const filterCiudad = document.getElementById('filterCiudad');
    const searchInput = document.getElementById('searchInput');
    const usuariosTableBody = document.getElementById('usuariosTableBody');
    const noUsersMessage = document.getElementById('noUsersMessage');
    const userDetailsModal = document.getElementById('userDetailsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const userDetailsContent = document.getElementById('userDetailsContent');

    // Elementos de estadísticas
    const totalUsuariosElement = document.getElementById('totalUsuarios');
    const usuariosActivosElement = document.getElementById('usuariosActivos');
    const totalElectricistasElement = document.getElementById('totalElectricistas');
    const usuariosMDPElement = document.getElementById('usuariosMDP');
    const lastUpdateElement = document.getElementById('lastUpdate');

    // Inicializar
    function inicializar() {
        cargarUsuarios();
        actualizarEstadisticas();
        actualizarTabla();
        actualizarHora();

        // Configurar eventos
        refreshBtn.addEventListener('click', refrescarDatos);
        exportBtn.addEventListener('click', exportarCSV);
        filterOficio.addEventListener('change', filtrarUsuarios);
        filterCiudad.addEventListener('change', filtrarUsuarios);
        searchInput.addEventListener('input', filtrarUsuarios);
        closeModalBtn.addEventListener('click', cerrarModal);

        // Cerrar modal al hacer clic fuera
        userDetailsModal.addEventListener('click', function (e) {
            if (e.target === userDetailsModal) {
                cerrarModal();
            }
        });

        // Actualizar cada 30 segundos
        setInterval(actualizarHora, 1000);

        console.log('Panel de administración inicializado');
    }

    // Cargar usuarios desde localStorage
    function cargarUsuarios() {
        try {
            const usuariosGuardados = localStorage.getItem('provecino_usuarios');
            usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
            usuariosFiltrados = [...usuarios];

            console.log(`Cargados ${usuarios.length} usuarios`);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            usuarios = [];
            usuariosFiltrados = [];
        }
    }

    // Actualizar estadísticas
    function actualizarEstadisticas() {
        const total = usuarios.length;
        const activos = usuarios.filter(u => u.activo !== false).length;
        const electricistas = usuarios.filter(u => u.oficio === 'electricista').length;
        const marDelPlata = usuarios.filter(u => u.ciudad === 'Mar del Plata').length;

        totalUsuariosElement.textContent = total;
        usuariosActivosElement.textContent = activos;
        totalElectricistasElement.textContent = electricistas;
        usuariosMDPElement.textContent = marDelPlata;
    }

    // Actualizar tabla
    function actualizarTabla() {
        usuariosTableBody.innerHTML = '';

        if (usuariosFiltrados.length === 0) {
            noUsersMessage.style.display = 'block';
            return;
        }

        noUsersMessage.style.display = 'none';

        usuariosFiltrados.forEach(usuario => {
            const row = document.createElement('tr');

            // Formatear fecha
            const fecha = usuario.fechaRegistro ?
                new Date(usuario.fechaRegistro).toLocaleDateString('es-AR') :
                '--/--/----';

            // Determinar estado
            const estado = usuario.activo !== false ?
                '<span class="status-badge status-active">Activo</span>' :
                '<span class="status-badge status-inactive">Inactivo</span>';

            row.innerHTML = `
                <td>${usuario.id || '--'}</td>
                <td>${usuario.nombre || ''} ${usuario.apellido || ''}</td>
                <td>${usuario.email || '--'}</td>
                <td>${usuario.telefono || '--'}</td>
                <td>
                    <span class="oficio-badge">${obtenerIconoOficio(usuario.oficio)} ${formatearOficio(usuario.oficio)}</span>
                </td>
                <td>${usuario.ciudad || '--'}</td>
                <td>${formatearExperiencia(usuario.experiencia)}</td>
                <td>${fecha}</td>
                <td>${estado}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-icon btn-view" onclick="verDetallesUsuario(${usuario.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-icon btn-edit" onclick="editarUsuario(${usuario.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-delete" onclick="eliminarUsuario(${usuario.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            usuariosTableBody.appendChild(row);
        });
    }

    // Funciones auxiliares de formato
    function obtenerIconoOficio(oficio) {
        const iconos = {
            'electricista': '⚡',
            'plomero': '🔧',
            'gasista': '🔥',
            'pintor': '🎨',
            'albanil': '🏠',
            'carpintero': '🪚',
            'mecanico': '🚗',
            'tecnico': '💻'
        };
        return iconos[oficio] || '👷';
    }

    function formatearOficio(oficio) {
        const oficios = {
            'electricista': 'Electricista',
            'plomero': 'Plomero',
            'gasista': 'Gasista',
            'pintor': 'Pintor',
            'albanil': 'Albañil',
            'carpintero': 'Carpintero',
            'mecanico': 'Mecánico',
            'tecnico': 'Técnico'
        };
        return oficios[oficio] || oficio || 'No especificado';
    }

    function formatearExperiencia(experiencia) {
        const experiencias = {
            'menos-1': '< 1 año',
            '1-3': '1-3 años',
            '3-5': '3-5 años',
            '5-10': '5-10 años',
            'mas-10': '> 10 años'
        };
        return experiencias[experiencia] || experiencia || 'No especificada';
    }

    // Filtrar usuarios
    function filtrarUsuarios() {
        const oficioSeleccionado = filterOficio.value;
        const ciudadSeleccionada = filterCiudad.value;
        const busqueda = searchInput.value.toLowerCase();

        usuariosFiltrados = usuarios.filter(usuario => {
            // Filtrar por oficio
            if (oficioSeleccionado !== 'todos' && usuario.oficio !== oficioSeleccionado) {
                return false;
            }

            // Filtrar por ciudad
            if (ciudadSeleccionada !== 'todos' && usuario.ciudad !== ciudadSeleccionada) {
                return false;
            }

            // Filtrar por búsqueda
            if (busqueda) {
                const textoBusqueda = `${usuario.nombre || ''} ${usuario.apellido || ''} ${usuario.email || ''} ${usuario.telefono || ''}`.toLowerCase();
                if (!textoBusqueda.includes(busqueda)) {
                    return false;
                }
            }

            return true;
        });

        actualizarTabla();
    }

    // Refrescar datos
    function refrescarDatos() {
        cargarUsuarios();
        actualizarEstadisticas();
        actualizarTabla();

        // Mostrar notificación
        mostrarNotificacion('Datos actualizados correctamente', 'success');
    }

    // Exportar a CSV
    function exportarCSV() {
        if (usuariosFiltrados.length === 0) {
            mostrarNotificacion('No hay datos para exportar', 'warning');
            return;
        }

        // Crear cabeceras CSV
        let csv = 'ID,Nombre,Email,Teléfono,Oficio,Ciudad,Experiencia,Fecha Registro,Estado\n';

        // Agregar datos
        usuariosFiltrados.forEach(usuario => {
            const estado = usuario.activo !== false ? 'Activo' : 'Inactivo';
            const fecha = usuario.fechaRegistro ?
                new Date(usuario.fechaRegistro).toLocaleDateString('es-AR') : '';

            csv += `${usuario.id || ''},` +
                `"${usuario.nombre || ''} ${usuario.apellido || ''}",` +
                `${usuario.email || ''},` +
                `${usuario.telefono || ''},` +
                `${formatearOficio(usuario.oficio)},` +
                `${usuario.ciudad || ''},` +
                `${formatearExperiencia(usuario.experiencia)},` +
                `${fecha},` +
                `${estado}\n`;
        });

        // Crear y descargar archivo
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `usuarios_provecino_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        mostrarNotificacion('CSV exportado correctamente', 'success');
    }

    // Ver detalles de usuario (función global)
    window.verDetallesUsuario = function (id) {
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) return;

        userDetailsContent.innerHTML = crearHTMLDetallesUsuario(usuario);
        userDetailsModal.classList.add('active');
    };

    function crearHTMLDetallesUsuario(usuario) {
        const fechaRegistro = usuario.fechaRegistro ?
            new Date(usuario.fechaRegistro).toLocaleString('es-AR') : 'No disponible';

        return `
            <div class="user-details-grid">
                <div class="detail-section">
                    <h3>Información Personal</h3>
                    <div class="detail-item">
                        <span class="detail-label">Nombre completo:</span>
                        <span class="detail-value">${usuario.nombre || ''} ${usuario.apellido || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${usuario.email || 'No especificado'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Teléfono:</span>
                        <span class="detail-value">${usuario.telefono || 'No especificado'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">DNI:</span>
                        <span class="detail-value">${usuario.dni || 'No especificado'}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Información Profesional</h3>
                    <div class="detail-item">
                        <span class="detail-label">Oficio principal:</span>
                        <span class="detail-value">${obtenerIconoOficio(usuario.oficio)} ${formatearOficio(usuario.oficio)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Experiencia:</span>
                        <span class="detail-value">${formatearExperiencia(usuario.experiencia)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Ciudad:</span>
                        <span class="detail-value">${usuario.ciudad || 'No especificada'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Descripción:</span>
                        <span class="detail-value">${usuario.descripcion || 'Sin descripción'}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Verificaciones y Seguridad</h3>
                    <div class="detail-item">
                        <span class="detail-label">Matrícula profesional:</span>
                        <span class="detail-value">${usuario.tieneMatricula ? 'Sí' : 'No'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Seguro de responsabilidad:</span>
                        <span class="detail-value">${usuario.tieneSeguro ? 'Sí' : 'No'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Aceptó términos:</span>
                        <span class="detail-value">${usuario.aceptaTerminos ? 'Sí' : 'No'}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Información del Sistema</h3>
                    <div class="detail-item">
                        <span class="detail-label">ID de usuario:</span>
                        <span class="detail-value">${usuario.id || '--'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha de registro:</span>
                        <span class="detail-value">${fechaRegistro}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estado:</span>
                        <span class="detail-value">
                            <span class="status-badge ${usuario.activo !== false ? 'status-active' : 'status-inactive'}">
                                ${usuario.activo !== false ? 'Activo' : 'Inactivo'}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    // Editar usuario (función global)
    window.editarUsuario = function (id) {
        if (confirm('¿Estás seguro de que quieres editar este usuario?')) {
            const usuario = usuarios.find(u => u.id === id);
            if (usuario) {
                // Aquí iría la lógica para editar
                // Por ahora solo mostramos un mensaje
                mostrarNotificacion(`Editando usuario: ${usuario.nombre}`, 'info');
            }
        }
    };

    // Eliminar usuario (función global)
    window.eliminarUsuario = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
            const indice = usuarios.findIndex(u => u.id === id);
            if (indice !== -1) {
                usuarios.splice(indice, 1);
                guardarUsuarios();
                refrescarDatos();
                mostrarNotificacion('Usuario eliminado correctamente', 'success');
            }
        }
    };

    // Guardar usuarios en localStorage
    function guardarUsuarios() {
        try {
            localStorage.setItem('provecino_usuarios', JSON.stringify(usuarios));
        } catch (error) {
            console.error('Error al guardar usuarios:', error);
            mostrarNotificacion('Error al guardar usuarios', 'error');
        }
    }

    // Cerrar modal
    function cerrarModal() {
        userDetailsModal.classList.remove('active');
    }

    // Actualizar hora
    function actualizarHora() {
        const ahora = new Date();
        const hora = ahora.toLocaleTimeString('es-AR');
        lastUpdateElement.textContent = `Última actualización: ${hora}`;
    }

    // Mostrar notificación
    function mostrarNotificacion(mensaje, tipo) {
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

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Agregar estilos CSS dinámicamente
    function agregarEstilos() {
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
            
            .oficio-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.25rem 0.75rem;
                background-color: var(--primary-light);
                color: var(--primary);
                border-radius: var(--radius-full);
                font-size: 0.875rem;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }

    // Ejecutar inicialización
    agregarEstilos();
    inicializar();
});