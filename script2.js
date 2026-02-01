// Анімація цифр статистики
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'), 10);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
        }, 16);
    });
}

// Слайдер відгуків
function initTestimonialsSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (!testimonials.length) return;

    let currentSlide = 0;

    function showSlide(index) {
        testimonials.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        testimonials[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % testimonials.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + testimonials.length) % testimonials.length);
    }

    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    let interval = setInterval(nextSlide, 5000);

    const slider = document.querySelector('.testimonials-slider');
    slider?.addEventListener('mouseenter', () => clearInterval(interval));
    slider?.addEventListener('mouseleave', () => {
        interval = setInterval(nextSlide, 5000);
    });
}

// Форма підписки
function initJoinForm() {
    const form = document.querySelector('.join-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        if (!input.value) return;

        input.value = '';

        const msg = document.createElement('div');
        msg.className = 'success-message';
        msg.textContent = 'Дякуємо за підписку!';

        form.after(msg);

        setTimeout(() => msg.remove(), 5000);
    });
}

// Анімація при скролі
function initScrollAnimations() {
    const elements = document.querySelectorAll('.mission-card, .team-member, .stat-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('stat-card')) {
                    animateStats();
                }
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    initTestimonialsSlider();
    initJoinForm();
    initScrollAnimations();
});
