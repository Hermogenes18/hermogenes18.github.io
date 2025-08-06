// Crear partículas flotantes
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const numParticles = 50;
    
    // Reproducir sonido de power-up al crear partículas
    playSound('powerUp');
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición inicial aleatoria
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        // Tamaño aleatorio
        const size = Math.random() * 2 + 2;
        particle.style.width = particle.style.height = size + 'px';
        
        // Velocidad aleatoria
        particle.style.animationDuration = Math.random() * 3 + 3 + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    // Reproducir sonido de nivel subiendo al completar la creación
    playSound('levelUp');
}

// Animación de texto tipo máquina de escribir
function typeWriter(element, text, speed = 50) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            // Agregar el caracter actual
            element.textContent += text.charAt(i);
            i++;
            
            // Hacer una pequeña pausa entre caracteres
            if (text.charAt(i) === '\n') {
                // Si es un salto de línea, esperar un poco más
                setTimeout(() => {
                    element.textContent += '\n';
                    i++;
                }, 100);
            }
        } else {
            clearInterval(interval);
        }
    }, speed);
}


// Sistema de sonidos
const sounds = {
    click: new Audio('sounds/click.wav'),
    levelUp: new Audio('sounds/level-up.wav'),
    powerUp: new Audio('sounds/power-up.wav'),
    openChest: new Audio('sounds/open-chest.wav')
};

// Configuración de volumen
const soundVolumes = {
    click: 0.1,     // 10% de volumen
    levelUp: 0.15,  // 15% de volumen
    powerUp: 0.2,   // 20% de volumen
    openChest: 0.15 // 15% de volumen
};

// Estado de los sonidos
let soundsEnabled = false;

// Inicializar sonidos
function initSounds() {
    // Pre-cargar sonidos y ajustar volumen
    Object.values(sounds).forEach(sound => {
        sound.preload = 'auto';
        sound.volume = 0.1; // Volumen base muy bajo
    });
    
    // Ajustar volumen específico de cada sonido
    Object.keys(sounds).forEach(soundName => {
        sounds[soundName].volume = soundVolumes[soundName];
    });
}

// Reproducir sonido
function playSound(soundName) {
    // Solo reproducir sonidos si están habilitados
    if (!soundsEnabled) return;
    
    const sound = sounds[soundName];
    if (sound) {
        // Crear una nueva instancia del sonido para mejor control
        const newSound = new Audio(sound.src);
        newSound.volume = soundVolumes[soundName];
        newSound.play().catch(error => {
            console.error('Error al reproducir sonido:', error);
        });
    }
}

// Habilitar sonidos después de la primera interacción del usuario
document.addEventListener('click', function() {
    soundsEnabled = true;
    // Reproducir un sonido de bienvenida
    playSound('levelUp');
}, { once: true });

document.addEventListener('keydown', function() {
    soundsEnabled = true;
    // Reproducir un sonido de bienvenida
    playSound('levelUp');
}, { once: true });

// Estado del Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

// Función para verificar el Konami Code
function checkKonamiCode(keyCode) {
    // Agregar el código actual
    konamiCode.push(keyCode);
    
    // Verificar si el código coincide
    if (konamiCode.length === konamiSequence.length) {
        // Comprobar si las secuencias son iguales
        let match = true;
        for (let i = 0; i < konamiSequence.length; i++) {
            if (konamiCode[i] !== konamiSequence[i]) {
                match = false;
                break;
            }
        }
        
        if (match) {
            console.log('Konami Code activado!');
            activateEasterEgg();
            konamiCode = [];
            return;
        }
    }
    
    // Si el código es demasiado largo, reiniciar
    if (konamiCode.length > konamiSequence.length) {
        konamiCode = [];
    }
}

// Función principal para manejar eventos de teclado
function handleKeyboardEvent(event) {
    // Solo proceder si los sonidos están habilitados
    if (!soundsEnabled) return;
    
    // Reproducir sonido de click
    playSound('click');
    
    // Verificar si es una tecla del código Konami
    const keyCode = event.keyCode || event.which;
    if (konamiSequence.includes(keyCode)) {
        // Verificar el Konami Code
        checkKonamiCode(keyCode);
        // Reproducir sonido de power-up al avanzar en el código
        playSound('powerUp');
    }
    
    // Añadir efecto visual
    const keyElement = document.createElement('div');
    keyElement.className = 'key-effect';
    keyElement.textContent = event.key;
    
    // Estilos básicos para el efecto
    keyElement.style.position = 'fixed';
    keyElement.style.zIndex = '1000';
    keyElement.style.padding = '10px';
    keyElement.style.borderRadius = '5px';
    keyElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    keyElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    keyElement.style.fontFamily = 'monospace';
    keyElement.style.fontSize = '16px';
    keyElement.style.color = '#333';
    
    // Posición aleatoria pero más controlada
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Asegurar que las teclas no se salgan de la pantalla
    const padding = 50; // Espacio de seguridad
    const randomX = Math.random() * (viewportWidth - padding * 2) + padding;
    const randomY = Math.random() * (viewportHeight - padding * 2) + padding;
    
    keyElement.style.left = randomX + 'px';
    keyElement.style.top = randomY + 'px';
    
    // Animación de aparición y desaparición
    keyElement.style.opacity = '1';
    keyElement.style.transition = 'opacity 0.5s ease-out';
    
    document.body.appendChild(keyElement);
    
    // Eliminar después de la animación
    setTimeout(() => {
        keyElement.style.opacity = '0';
        setTimeout(() => {
            keyElement.remove();
        }, 500);
    }, 1000);
    
    // Cerrar modales con Escape
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            const modalType = openModal.id.replace('Modal', '');
            closeModal(modalType);
        }
    }
}


// Abrir modal
function openModal(modalType) {
    const modal = document.getElementById(modalType + 'Modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Reproducir sonido de abrir cofre para modales
        playSound('openChest');
        
        // Si es el modal de perfil, aplicar la animación de texto
        if (modalType === 'profile') {
            const dialogueText = modal.querySelector('.animated-text');
            if (dialogueText) {
                dialogueText.textContent = '';
                const text = 'Soy desarrollador de software bachiller de Ciencia de la Computación, con experiencia en desarrollo de aplicaciones web y móviles. Apasionado por la programación y la resolución de problemas, busco trabajar en proyectos desafiantes y emocionantes que me permitan aplicar y mejorar mis habilidades de programación y resolución de problemas.';
                typeWriter(dialogueText, text, 10);
            }
        }
    }
}

// Cerrar modal
function closeModal(modalType) {
    const modal = document.getElementById(modalType + 'Modal');
    if (modal) {
        // Reproducir sonido de click
        playSound('click');
        modal.style.display = 'none';
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(event) {
    const modal = event.target.closest('.modal');
    if (modal && !event.target.closest('.modal-content')) {
        const modalType = modal.id.replace('Modal', '');
            closeModal(modalType);
    }
});

// Función para inicializar el teclado
function initKeyboard() {
    // Reproducir sonido de power-up al inicializar el teclado
    playSound('powerUp');
    
    // Agregar eventos de teclado
    document.addEventListener('keydown', function(event) {
        // Reproducir sonido de click al presionar tecla
        playSound('click');
    });
}

// Efecto de sonido al iniciar el juego
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Reproducir sonido de nivel subiendo al iniciar
    playSound('levelUp');
    
    // Inicializar sonidos
    initSounds();
    
    // Mostrar estadísticas del desarrollador
    showDeveloperStats();
    
    // Inicializar eventos de teclado
    document.addEventListener('keydown', handleKeyboardEvent);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.style.filter = 'brightness(0.9)';
    }
});


// Agregar evento de teclado
// Ya está manejado en el DOMContentLoaded


// Activar el Easter Egg
function activateEasterEgg() {
    // Reproducir sonido de power-up al activar el Easter Egg
    playSound('powerUp');
    
    // Activar modo pixel art extremo
    document.body.classList.add('pixel-mode');
    
    // Mostrar mensaje de felicitación
    const easterMessage = document.createElement('div');
    easterMessage.className = 'dialogue-box';
    easterMessage.style.position = 'fixed';
    easterMessage.style.top = '50%';
    easterMessage.style.left = '50%';
    easterMessage.style.transform = 'translate(-50%, -50%)';
    easterMessage.style.zIndex = '9999';
    easterMessage.style.textAlign = 'center';
    easterMessage.style.animation = 'pixelPulse 1s infinite';
    
    easterMessage.innerHTML = `
        🎮 ¡Easter Egg Activado! 🎮<br>
        🏆 ¡Bienvenido al Modo Pixel Art Extremo! 🏆<br>
        🎮 ¡Disfruta del espectáculo de colores! 🎮
    `;
    
    document.body.appendChild(easterMessage);
    
    // Eliminar mensaje después de 5 segundos
    setTimeout(() => {
        easterMessage.remove();
        // Desactivar modo después de 10 segundos
        setTimeout(() => {
            document.body.classList.remove('pixel-mode');
        }, 5000);
    }, 5000);
}

// Función para mostrar estadísticas del desarrollador
function showDeveloperStats() {
    const stats = {
        proyectos: 15,
        horasCodificadas: 1200,
        tecnologias: ['HTML', 'CSS', 'JavaScript', 'Python', 'Node.js'],
        logros: ['Proyecto más grande', 'Más horas de codificación', 'Mejor optimización']
    };
    
    console.log('Estadísticas del Desarrollador:', stats);
}


// Agregar funciones adicionales al objeto window para debug
window.adventurePortfolio = {
    showStats: showDeveloperStats
};
