/* ==========================================================================
   CONFIGURACIÓN DE TAILWIND CSS
   ========================================================================== */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#1A0738',
                    deep: '#2E1065',
                    primary: '#4A154B',
                    violet: '#7C3AED',
                    pink: '#DB2777',
                    pinkLight: '#F472B6',
                    roseBg: '#FDF2F8',
                    purpleBg: '#FAF5FF',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        }
    }
};

/* ==========================================================================
   CONTROL DEL MENÚ MÓVIL
   ========================================================================== */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    
    if (!menu || !icon) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        menu.classList.add('hidden');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
}

/* ==========================================================================
   INICIALIZACIÓN AL CARGAR EL DOM
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración del Intersection Observer para el Scroll-Reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.10
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Inicializar Motor de Partículas
    initParticles();
});

/* ==========================================================================
   MOTOR DE PARTÍCULAS INTERACTIVAS (CANVAS)
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Seguimiento del cursor en desktop
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Soporte táctil para móviles
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Generar partículas
    const particles = Array.from({ length: 42 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.35 + 0.15
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Rebote o loop en los bordes
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Reacción sutil al cursor o toque
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    p.x -= (dx / distance) * 0.5;
                    p.y -= (dy / distance) * 0.5;
                }
            }

            // Dibujar partícula
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}