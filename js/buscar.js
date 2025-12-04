// ============================================
// JavaScript para la página de búsqueda
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    let currentFilters = {
        query: '',
        ciudad: 'todos',
        servicio: 'todos',
        urgencia: 'todos',
        minPrice: '',
        maxPrice: '',
        minRating: 0,
        verifiedOnly: false,
        experience5: false
    };

    // Datos de ejemplo de profesionales
    const profesionalesEjemplo = [
        {
            id: 1,
            nombre: "Juan Pérez",
            categoria: "Electricista",
            avatar: "JP",
            rating: 4.8,
            reviews: 128,
            experiencia: 8,
            verificacion: true,
            disponibleHoy: true,
            precio: 1500,
            zona: "Centro",
            descripcion: "Especialista en instalaciones eléctricas residenciales. Trabajos con garantía."
        },
        {
            id: 2,
            nombre: "María López",
            categoria: "Plomería",
            avatar: "ML",
            rating: 4.9,
            reviews: 95,
            experiencia: 5,
            verificacion: true,
            disponibleHoy: true,
            precio: 1200,
            zona: "Puerto",
            descripcion: "Soluciones rápidas para problemas de plomería. Atención 24/7 para emergencias."
        },
        {
            id: 3,
            nombre: "Carlos Rodríguez",
            categoria: "Pintor",
            avatar: "CR",
            rating: 4.7,
            reviews: 210,
            experiencia: 12,
            verificacion: true,
            disponibleHoy: false,
            precio: 1800,
            zona: "La Perla",
            descripcion: "Pintura interior y exterior. Presupuestos sin cargo."
        },
        {
            id: 4,
            nombre: "Ana Martínez",
            categoria: "Gasista",
            avatar: "AM",
            rating: 4.9,
            reviews: 156,
            experiencia: 10,
            verificacion: true,
            disponibleHoy: true,
            precio: 2000,
            zona: "Las Canteras",
            descripcion: "Especialista en instalaciones de gas. Certificado MAT."
        },
        {
            id: 5,
            nombre: "Luis Fernández",
            categoria: "Albañil",
            avatar: "LF",
            rating: 4.6,
            reviews: 189,
            experiencia: 15,
            verificacion: true,
            disponibleHoy: false,
            precio: 1700,
            zona: "Villa St. John",
            descripcion: "Construcción y refacciones. Trabajos en seco y húmedo."
        },
        {
            id: 6,
            nombre: "Sofía Gómez",
            categoria: "Carpintero",
            avatar: "SG",
            rating: 4.8,
            reviews: 97,
            experiencia: 7,
            verificacion: true,
            disponibleHoy: true,
            precio: 1600,
            zona: "Plaza Peralta Ramos",
            descripcion: "Muebles a medida y trabajos en madera. Diseño personalizado."
        }
    ];

    // Elementos del DOM
    const searchForm = document.getElementById('searchForm');
    const searchQuery = document.getElementById('searchQuery');
    const ciudadSelect = document.getElementById('ciudad');
    const servicioSelect = document.getElementById('servicio');
    const urgenciaSelect = document.getElementById('urgencia');
    const resultsList = document.getElementById('resultsList');
    const resultsCount = document.getElementById('resultsCount');
    const resultsQuery = document.getElementById('resultsQuery');
    const noResults = document.getElementById('noResults');
    const moreFiltersBtn = document.getElementById('moreFiltersBtn');
    const filtersModal = document.getElementById('filtersModal');
    const closeFiltersBtn = document.getElementById('closeFiltersBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const sortBy = document.getElementById('sortBy');
    const stars = document.querySelectorAll('.busqueda-estrellas i');

    // Funciones auxiliares
    function updateResultsCount(count) {
        resultsCount.textContent = `${count} ${count === 1 ? 'profesional encontrado' : 'profesionales encontrados'}`;
    }

    function updateResultsQuery(query, ciudad) {
        const queryText = query ? `para "${query}"` : '';
        const ciudadText = ciudad && ciudad !== 'todos' ? `en ${ciudad}` : 'en Mar del Plata';
        resultsQuery.textContent = `${queryText} ${ciudadText}`.trim();
    }

    // Generar tarjeta de profesional
    function createProfessionalCard(profesional) {
        const ratingStars = Array(5).fill().map((_, i) =>
            i < Math.floor(profesional.rating) ? 'fas fa-star' : 'far fa-star'
        ).join(' ');

        return `
            <div class="busqueda-profesional-card" data-id="${profesional.id}">
                <div class="busqueda-profesional-card-header">
                    <div class="busqueda-profesional-info">
                        <div class="busqueda-profesional-avatar">
                            ${profesional.avatar}
                        </div>
                        <div class="busqueda-profesional-detalles">
                            <h3>${profesional.nombre}</h3>
                            <span class="busqueda-profesional-categoria">${profesional.categoria}</span>
                            ${profesional.verificacion ?
                `<div class="busqueda-profesional-verificacion">
                                    <i class="fas fa-check-circle"></i>
                                    Verificado
                                </div>` : ''
            }
                        </div>
                    </div>
                    <div class="busqueda-profesional-rating">
                        <i class="fas fa-star"></i>
                        <span>${profesional.rating}</span>
                        <span class="busqueda-rating-count">(${profesional.reviews})</span>
                    </div>
                </div>
                
                <p class="busqueda-profesional-descripcion">${profesional.descripcion}</p>
                
                <div class="busqueda-profesional-meta">
                    <div class="busqueda-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${profesional.zona}</span>
                    </div>
                    <div class="busqueda-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${profesional.experiencia} años exp.</span>
                    </div>
                    <div class="busqueda-meta-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>$${profesional.precio}/hora</span>
                    </div>
                    <div class="busqueda-meta-item">
                        <i class="fas ${profesional.disponibleHoy ? 'fa-check-circle success' : 'fa-calendar'}"></i>
                        <span>${profesional.disponibleHoy ? 'Disponible hoy' : 'Consultar disponibilidad'}</span>
                    </div>
                </div>
                
                <div class="busqueda-profesional-acciones">
                    <button class="btn btn-primary btn-sm" onclick="verPerfilBusqueda(${profesional.id})">
                        <i class="fas fa-eye"></i>
                        Ver Perfil
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="contactarProfesionalBusqueda(${profesional.id})">
                        <i class="fab fa-whatsapp"></i>
                        Contactar
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="guardarProfesionalBusqueda(${profesional.id})">
                        <i class="far fa-bookmark"></i>
                        Guardar
                    </button>
                </div>
            </div>
        `;
    }

    // Mostrar resultados
    function displayResults(profesionales) {
        if (profesionales.length === 0) {
            resultsList.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        let html = '';
        profesionales.forEach(profesional => {
            html += createProfessionalCard(profesional);
        });
        resultsList.innerHTML = html;
        updateResultsCount(profesionales.length);
    }

    // Filtrar profesionales
    function filterProfessionals() {
        let filtered = [...profesionalesEjemplo];

        // Filtro por búsqueda
        if (currentFilters.query) {
            const query = currentFilters.query.toLowerCase();
            filtered = filtered.filter(p =>
                p.nombre.toLowerCase().includes(query) ||
                p.categoria.toLowerCase().includes(query) ||
                p.descripcion.toLowerCase().includes(query)
            );
        }

        // Filtro por ciudad
        if (currentFilters.ciudad !== 'todos') {
            filtered = filtered.filter(p => p.zona === currentFilters.ciudad);
        }

        // Filtro por servicio
        if (currentFilters.servicio !== 'todos') {
            filtered = filtered.filter(p => {
                const servicioMap = {
                    'electricidad': 'Electricista',
                    'plomeria': 'Plomería',
                    'gas': 'Gasista',
                    'pintura': 'Pintor',
                    'albanileria': 'Albañil',
                    'carpinteria': 'Carpintero',
                    'mecanica': 'Mecánico'
                };
                return p.categoria === servicioMap[currentFilters.servicio];
            });
        }

        // Filtro por urgencia
        if (currentFilters.urgencia === 'hoy') {
            filtered = filtered.filter(p => p.disponibleHoy);
        }

        // Filtro por precio
        if (currentFilters.minPrice) {
            filtered = filtered.filter(p => p.precio >= parseInt(currentFilters.minPrice));
        }
        if (currentFilters.maxPrice) {
            filtered = filtered.filter(p => p.precio <= parseInt(currentFilters.maxPrice));
        }

        // Filtro por rating
        if (currentFilters.minRating > 0) {
            filtered = filtered.filter(p => p.rating >= currentFilters.minRating);
        }

        // Filtro por verificación
        if (currentFilters.verifiedOnly) {
            filtered = filtered.filter(p => p.verificacion);
        }

        // Filtro por experiencia
        if (currentFilters.experience5) {
            filtered = filtered.filter(p => p.experiencia >= 5);
        }

        // Ordenar resultados
        const sortValue = sortBy.value;
        switch (sortValue) {
            case 'calificacion':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'precio-bajo':
                filtered.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-alto':
                filtered.sort((a, b) => b.precio - a.precio);
                break;
            case 'proximidad':
                // Orden aleatorio para simular proximidad
                filtered.sort(() => Math.random() - 0.5);
                break;
            // 'relevancia' mantiene el orden original
        }

        displayResults(filtered);
        updateResultsQuery(currentFilters.query, ciudadSelect.options[ciudadSelect.selectedIndex].text);
    }

    // Event Listeners
    // Formulario de búsqueda
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        currentFilters.query = searchQuery.value.trim();
        currentFilters.ciudad = ciudadSelect.value;
        currentFilters.servicio = servicioSelect.value;
        currentFilters.urgencia = urgenciaSelect.value;
        filterProfessionals();
    });

    // Filtros en tiempo real
    ciudadSelect.addEventListener('change', () => {
        currentFilters.ciudad = ciudadSelect.value;
        filterProfessionals();
    });

    servicioSelect.addEventListener('change', () => {
        currentFilters.servicio = servicioSelect.value;
        filterProfessionals();
    });

    urgenciaSelect.addEventListener('change', () => {
        currentFilters.urgencia = urgenciaSelect.value;
        filterProfessionals();
    });

    // Modal de filtros avanzados
    moreFiltersBtn.addEventListener('click', () => {
        filtersModal.style.display = 'flex';
    });

    closeFiltersBtn.addEventListener('click', () => {
        filtersModal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera
    filtersModal.addEventListener('click', (e) => {
        if (e.target === filtersModal) {
            filtersModal.style.display = 'none';
        }
    });

    // Selección de estrellas para rating
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            currentFilters.minRating = value;

            // Actualizar visual de estrellas
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= value) {
                    s.classList.add('activa');
                } else {
                    s.classList.remove('activa');
                }
            });

            // Actualizar texto
            const ratingText = document.getElementById('selectedRatingText');
            ratingText.textContent = value === 5 ? '5 estrellas' : `${value}+ estrellas`;
        });
    });

    // Aplicar filtros avanzados
    applyFiltersBtn.addEventListener('click', () => {
        currentFilters.minPrice = document.getElementById('minPrice').value;
        currentFilters.maxPrice = document.getElementById('maxPrice').value;
        currentFilters.verifiedOnly = document.getElementById('verifiedOnly').checked;
        currentFilters.experience5 = document.getElementById('experience5').checked;

        filtersModal.style.display = 'none';
        filterProfessionals();
    });

    // Limpiar filtros
    clearFiltersBtn.addEventListener('click', () => {
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('verifiedOnly').checked = false;
        document.getElementById('experience5').checked = false;
        stars.forEach(star => star.classList.remove('activa'));
        document.getElementById('selectedRatingText').textContent = 'Cualquier calificación';

        currentFilters.minPrice = '';
        currentFilters.maxPrice = '';
        currentFilters.minRating = 0;
        currentFilters.verifiedOnly = false;
        currentFilters.experience5 = false;
    });

    clearSearchBtn.addEventListener('click', () => {
        searchQuery.value = '';
        currentFilters.query = '';
        ciudadSelect.value = 'todos';
        servicioSelect.value = 'todos';
        urgenciaSelect.value = 'todos';

        // Limpiar también filtros avanzados
        clearFiltersBtn.click();

        filterProfessionals();
    });

    // Ordenar resultados
    sortBy.addEventListener('change', filterProfessionals);

    // Botón para ver mapa completo
    const toggleMapBtn = document.getElementById('toggleMapBtn');
    if (toggleMapBtn) {
        toggleMapBtn.addEventListener('click', () => {
            alert('Función de mapa completo - En desarrollo');
        });
    }

    // Funciones globales para botones
    window.verPerfilBusqueda = function (id) {
        alert(`Ver perfil del profesional ${id} - En desarrollo`);
    };

    window.contactarProfesionalBusqueda = function (id) {
        const profesional = profesionalesEjemplo.find(p => p.id === id);
        if (profesional) {
            const mensaje = encodeURIComponent(`Hola ${profesional.nombre}, vi tu perfil en Provecino y me interesa contactarte para un trabajo.`);
            window.open(`https://wa.me/5492231234567?text=${mensaje}`, '_blank');
        }
    };

    window.guardarProfesionalBusqueda = function (id) {
        const card = document.querySelector(`.busqueda-profesional-card[data-id="${id}"]`);
        const btn = card.querySelector('.fa-bookmark');

        if (btn.classList.contains('far')) {
            btn.classList.remove('far');
            btn.classList.add('fas');
            alert('Profesional guardado en favoritos');
        } else {
            btn.classList.remove('fas');
            btn.classList.add('far');
            alert('Profesional eliminado de favoritos');
        }
    };

    // Inicializar resultados al cargar
    filterProfessionals();
});