// ============================================
// JavaScript para la página de Registro/Login
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    let currentStep = 1;
    const totalSteps = 3;
    let userData = {};

    // Elementos del DOM
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const successMessage = document.getElementById('successMessage');
    const switchToRegister = document.getElementById('switchToRegister');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const currentStepElement = document.getElementById('currentStep');
    const nextStepButtons = document.querySelectorAll('.next-step');
    const prevStepButtons = document.querySelectorAll('.prev-step');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const skillOptions = document.querySelectorAll('.skill-option input');
    const verificationOptions = document.querySelectorAll('.verification-option input');

    // Inicializar selector de tipo de autenticación
    function inicializarSelectorAuth() {
        registerBtn.addEventListener('click', function () {
            registerBtn.classList.add('active');
            loginBtn.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            successMessage.classList.remove('active');
        });

        loginBtn.addEventListener('click', function () {
            loginBtn.classList.add('active');
            registerBtn.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            successMessage.classList.remove('active');
        });

        switchToRegister.addEventListener('click', function () {
            registerBtn.click();
        });
    }

    // Manejar pasos del formulario
    function inicializarPasosFormulario() {
        // Botones Siguiente
        nextStepButtons.forEach(button => {
            button.addEventListener('click', function () {
                const nextStepId = this.getAttribute('data-next');

                // Validar paso actual antes de continuar
                if (validarPasoActual()) {
                    cambiarPaso(nextStepId);
                }
            });
        });

        // Botones Atrás
        prevStepButtons.forEach(button => {
            button.addEventListener('click', function () {
                const prevStepId = this.getAttribute('data-prev');
                cambiarPaso(prevStepId);
            });
        });
    }

    // Validar paso actual
    function validarPasoActual() {
        const currentStepElement = document.querySelector('.form-step.active');

        // Validar campos requeridos del paso actual
        const requiredInputs = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;

                // Crear mensaje de error si no existe
                if (!input.nextElementSibling?.classList.contains('error-message')) {
                    const errorMsg = document.createElement('small');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Este campo es requerido';
                    errorMsg.style.color = 'var(--error)';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg?.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });

        // Validación específica para cada paso
        if (currentStep === 1) {
            const email = document.getElementById('email');
            const telefono = document.getElementById('telefono');

            // Validar email
            if (email.value && !validarEmail(email.value)) {
                mostrarError(email, 'Ingresá un email válido');
                isValid = false;
            }

            // Validar teléfono (al menos 8 dígitos)
            if (telefono.value && !validarTelefono(telefono.value)) {
                mostrarError(telefono, 'Ingresá un teléfono válido');
                isValid = false;
            }
        }

        if (currentStep === 2) {
            const oficioSeleccionado = document.querySelector('input[name="oficio"]:checked');
            const experiencia = document.getElementById('experiencia');

            if (!oficioSeleccionado) {
                mostrarErrorGeneral('Seleccioná tu oficio principal');
                isValid = false;
            }

            if (!experiencia.value) {
                mostrarError(experiencia, 'Seleccioná tu experiencia');
                isValid = false;
            }
        }

        if (currentStep === 3) {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            const dni = document.getElementById('dni');
            const aceptaTerminos = document.getElementById('aceptaTerminos');

            // Validar contraseña
            if (password.value && !validarPassword(password.value)) {
                mostrarError(password, 'Mínimo 8 caracteres, con letras y números');
                isValid = false;
            }

            // Validar que las contraseñas coincidan
            if (password.value !== confirmPassword.value) {
                mostrarError(confirmPassword, 'Las contraseñas no coinciden');
                isValid = false;
            }

            // Validar DNI
            if (dni.value && !validarDNI(dni.value)) {
                mostrarError(dni, 'Ingresá un DNI válido');
                isValid = false;
            }

            // Validar términos y condiciones
            if (!aceptaTerminos.checked) {
                mostrarErrorGeneral('Debés aceptar los términos y condiciones');
                isValid = false;
            }
        }

        return isValid;
    }

    // Funciones de validación
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validarTelefono(telefono) {
        const re = /^[0-9\s\-\+\(\)]{8,15}$/;
        return re.test(telefono);
    }

    function validarPassword(password) {
        const re = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        return re.test(password);
    }

    function validarDNI(dni) {
        const re = /^[0-9]{7,8}$/;
        return re.test(dni);
    }

    function mostrarError(input, mensaje) {
        input.classList.add('error');
        const errorMsg = document.createElement('small');
        errorMsg.className = 'error-message';
        errorMsg.textContent = mensaje;
        errorMsg.style.color = 'var(--error)';
        errorMsg.style.display = 'block';
        errorMsg.style.marginTop = '0.25rem';
        input.parentNode.insertBefore(errorMsg, input.nextSibling);
    }

    function mostrarErrorGeneral(mensaje) {
        const currentStepElement = document.querySelector('.form-step.active');
        const existingError = currentStepElement.querySelector('.general-error');

        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'general-error';
        errorDiv.style.backgroundColor = 'var(--error-light)';
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.padding = '1rem';
        errorDiv.style.borderRadius = 'var(--radius)';
        errorDiv.style.marginBottom = '1rem';
        errorDiv.style.textAlign = 'center';
        errorDiv.textContent = mensaje;

        currentStepElement.insertBefore(errorDiv, currentStepElement.firstChild);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Cambiar paso del formulario
    function cambiarPaso(stepId) {
        // Guardar datos del paso actual
        guardarDatosPasoActual();

        // Ocultar paso actual
        steps.forEach(step => step.classList.remove('active'));

        // Mostrar nuevo paso
        document.getElementById(stepId).classList.add('active');

        // Actualizar progreso
        currentStep = parseInt(stepId.replace('step', ''));
        actualizarProgreso();
    }

    // Guardar datos del paso actual
    function guardarDatosPasoActual() {
        const currentStepElement = document.querySelector('.form-step.active');
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.type === 'radio' && input.checked) {
                userData[input.name] = input.value;
            } else if (input.type !== 'radio') {
                userData[input.id] = input.value;
            }
        });

        console.log('Datos guardados:', userData);
    }

    // Actualizar barra de progreso
    function actualizarProgreso() {
        // Actualizar pasos visuales
        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Actualizar texto
        currentStepElement.textContent = currentStep;
    }

    // Toggle visibilidad de contraseña
    function inicializarPasswordToggle() {
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                const input = this.previousElementSibling;
                const icon = this.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    // Manejar selección de oficios
    function inicializarOficios() {
        skillOptions.forEach(option => {
            option.addEventListener('change', function () {
                // Remover selección previa visualmente
                skillOptions.forEach(opt => {
                    const card = opt.nextElementSibling;
                    card.classList.remove('selected');
                });

                // Marcar selección actual
                const card = this.nextElementSibling;
                card.classList.add('selected');

                // Guardar selección
                userData.oficio = this.value;
            });
        });
    }

    // Manejar verificación opcional
    function inicializarVerificacion() {
        verificationOptions.forEach(option => {
            option.addEventListener('change', function () {
                if (this.checked) {
                    userData[this.id] = true;
                } else {
                    delete userData[this.id];
                }
            });
        });
    }

    // Manejar envío de formulario de registro
    function inicializarEnvioRegistro() {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validar paso final
            if (validarPasoActual()) {
                // Guardar datos finales
                guardarDatosPasoActual();

                // Simular envío al servidor
                simularEnvioRegistro();
            }
        });
    }

    // Simular envío de registro
    function simularEnvioRegistro() {
        // Mostrar carga
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;

        // Guardar usuario en localStorage
        guardarUsuarioEnLocalStorage(userData);

        // Simular delay de red
        setTimeout(() => {
            // Mostrar mensaje de éxito
            registerForm.classList.remove('active');
            successMessage.classList.add('active');

            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Guardar datos en localStorage (simulación)
            localStorage.setItem('provecino_user', JSON.stringify(userData));

            // Mostrar datos en consola
            console.log('Usuario registrado:', userData);

            // Redirección automática después de 3 segundos
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 3000);
        }, 1500);


        function guardarUsuarioEnLocalStorage(usuario) {
            // Obtener usuarios existentes
            let usuarios = JSON.parse(localStorage.getItem('provecino_usuarios')) || [];

            // Agregar ID y fecha
            usuario.id = Date.now();
            usuario.fechaRegistro = new Date().toISOString();
            usuario.activo = true;

            // Agregar nuevo usuario
            usuarios.push(usuario);

            // Guardar en localStorage
            localStorage.setItem('provecino_usuarios', JSON.stringify(usuarios));

            console.log('Usuario guardado en localStorage:', usuario);
        }

    }

    // Manejar envío de formulario de login
    function inicializarEnvioLogin() {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                mostrarErrorGeneral('Completá todos los campos');
                return;
            }

            // Simular login
            simularLogin(email, password);
        });
    }

    // Simular login
    function simularLogin(email, password) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Aquí iría la lógica real de autenticación

            // Simular éxito
            mostrarNotificacion('¡Bienvenido de nuevo!', 'success');

            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Redirección
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        }, 1500);
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

        if (tipo === 'success') {
            notification.style.backgroundColor = 'var(--success)';
            notification.style.color = 'white';
        } else {
            notification.style.backgroundColor = 'var(--error)';
            notification.style.color = 'white';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Agregar animaciones CSS dinámicamente
    function agregarAnimaciones() {
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
            
            .skill-card.selected {
                border-color: var(--primary);
                background-color: var(--primary-light);
                color: var(--primary);
            }
            
            .skill-card.selected i {
                color: var(--primary);
            }
            
            .form-input.error {
                border-color: var(--error);
            }
            
            .form-input.error:focus {
                box-shadow: 0 0 0 3px color-mix(in srgb, var(--error) 20%, transparent);
            }
        `;
        document.head.appendChild(style);
    }

    // Inicializar todas las funcionalidades
    function inicializarTodo() {
        inicializarSelectorAuth();
        inicializarPasosFormulario();
        inicializarPasswordToggle();
        inicializarOficios();
        inicializarVerificacion();
        inicializarEnvioRegistro();
        inicializarEnvioLogin();
        agregarAnimaciones();

        // Iniciar en paso 1
        actualizarProgreso();

        console.log('Página de registro/login inicializada');
    }

    // Ejecutar inicialización
    inicializarTodo();
});