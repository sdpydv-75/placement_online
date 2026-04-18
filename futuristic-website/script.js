// Custom Cursor Logic
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

window.addEventListener('mousemove', (e) => {
    // Small dot follows instantly
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    
    // Ring follows with a slight delay using requestAnimationFrame for smoothness
    requestAnimationFrame(() => {
        ring.style.left = `${e.clientX}px`;
        ring.style.top = `${e.clientY}px`;
    });
});

// Cursor Hover Effects
const interactables = document.querySelectorAll('a, button, input, textarea');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        ring.style.width = '60px';
        ring.style.height = '60px';
        ring.style.background = 'rgba(0, 240, 255, 0.1)';
        dot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.background = 'transparent';
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const toggleBtn = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if(navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if(navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            toggleBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
        }
    });
});

// Subtle Parallax Effect for Background Elements
document.addEventListener('mousemove', (e) => {
    const floaters = document.querySelectorAll('.side-geo');
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    floaters.forEach(floater => {
        // Only apply parallax, keep the CSS animation intact by using a parent wrapper in standard designs, 
        // stringing multiple transforms can override the CSS animations. 
        // But since we use translateY for animation, we can use margin or left/top for parallax.
        floater.style.marginLeft = `${x}px`;
        floater.style.marginTop = `${y}px`;
    });
});

// Form Submission Prevention (for demo)
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Transmitted successfully <i class="fa-solid fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
        e.target.reset();
        btn.innerHTML = originalText;
        btn.style.background = ''; // reset to CSS defined
    }, 3000);
});
