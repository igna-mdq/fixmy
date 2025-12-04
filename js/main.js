// Datos mock para profesionales destacados
const featuredProfessionals = [
    {
        id: 1,
        name: "Juan Pérez",
        profession: "Electricista",
        rating: 4.8,
        reviews: 42,
        location: "Centro, MDP",
        price: "Desde $5.000",
        verified: true,
        available: true,
        image: null
    },
    {
        id: 2,
        name: "María García",
        profession: "Plomera",
        rating: 4.9,
        reviews: 38,
        location: "Villa St. John, MDP",
        price: "Desde $4.500",
        verified: true,
        available: true,
        image: null
    },
    {
        id: 3,
        name: "Carlos Rodríguez",
        profession: "Gasista Matriculado",
        rating: 5.0,
        reviews: 56,
        location: "La Perla, MDP",
        price: "Desde $6.000",
        verified: true,
        available: false,
        image: null
    },
    {
        id: 4,
        name: "Ana Martínez",
        profession: "Pintora",
        rating: 4.7,
        reviews: 29,
        location: "Las Canteras, MDP",
        price: "Desde $3.500 m²",
        verified: false,
        available: true,
        image: null
    }
];

// Función para generar estrellas de rating
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return stars;
}

// Función para renderizar profesionales destacados
function renderFeaturedProfessionals() {
    const container = document.getElementById('featuredProfessionals');

    if (!container) return;

    const professionalsHTML = featuredProfessionals.map(prof => `
    <div class="professional-card">
      <div class="professional-header">
        ${prof.verified ? '<span class="badge verified"><i class="fas fa-check-circle"></i> Verificado</span>' : ''}
        ${prof.available ? '<span class="badge available"><i class="fas fa-clock"></i> Disponible hoy</span>' : ''}
      </div>
      
      <div class="professional-avatar">
        ${prof.image ?
            `<img src="${prof.image}" alt="${prof.name}">` :
            `<div class="avatar-placeholder">${prof.name.charAt(0)}</div>`
        }
      </div>
      
      <div class="professional-info">
        <h3 class="professional-name">${prof.name}</h3>
        <p class="professional-profession">${prof.profession}</p>
        
        <div class="professional-rating">
          <div class="stars">
            ${generateStarRating(prof.rating)}
          </div>
          <span class="rating-text">${prof.rating} (${prof.reviews} reseñas)</span>
        </div>
        
        <div class="professional-details">
          <p class="location"><i class="fas fa-map-marker-alt"></i> ${prof.location}</p>
          <p class="price"><i class="fas fa-tag"></i> ${prof.price}</p>
        </div>
      </div>
      
      <div class="professional-actions">
        <a href="/perfil/${prof.id}" class="btn btn-outline btn-block">Ver perfil</a>
      </div>
    </div>
  `).join('');

    container.innerHTML = professionalsHTML;
}

// Menú móvil toggle
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
        const isVisible = mobileMenu.style.display === 'flex';
        mobileMenu.style.display = isVisible ? 'none' : 'flex';
        menuToggle.innerHTML = isVisible ?
            '<i class="fas fa-bars"></i>' :
            '<i class="fas fa-times"></i>';
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProfessionals();
    setupMobileMenu();

    console.log('Provecino - Prototipo cargado');
});