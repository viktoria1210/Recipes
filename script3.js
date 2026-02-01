// Валідація форми
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const okBtn = document.getElementById('okBtn');
    const submitBtn = document.getElementById('submitBtn');
    const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '').substring(0, 12);

    let formatted = '';

    if (value.length > 0) formatted = '+38 ';
    if (value.length > 2) formatted += '(' + value.substring(2, 5) + ') ';
    if (value.length > 5) formatted += value.substring(5, 8);
    if (value.length > 8) formatted += '-' + value.substring(8, 10);
    if (value.length > 10) formatted += '-' + value.substring(10, 12);

    e.target.value = formatted;
});

    // Валідація форми
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Очищення попередніх помилок
        clearErrors();
        
        // Валідація полів
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Валідація імені
        if (!name.value.trim()) {
            showError('name', 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            showError('name', 'Ім\'я має містити щонайменше 2 символи');
            isValid = false;
        }
        
        // Валідація email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError('email', 'Будь ласка, введіть вашу електронну пошту');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError('email', 'Будь ласка, введіть коректну електронну пошту');
            isValid = false;
        }
        
    
        
        // Валідація повідомлення
        if (!message.value.trim()) {
            showError('message', 'Будь ласка, введіть ваше повідомлення');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError('message', 'Повідомлення має містити щонайменше 10 символів');
            isValid = false;
        }
        
        // Якщо форма валідна
        if (isValid) {
            // Показати завантаження
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Відправка...</span><i class="fas fa-spinner fa-spin"></i>';
            
            // Симуляція відправки форми (у реальному додатку тут буде AJAX запит)
            setTimeout(() => {

                
                // Показати модальне вікно успіху
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Відновити кнопку
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Надіслати повідомлення</span><i class="fas fa-paper-plane"></i>';
                
                // Скидання форми
                contactForm.reset();

                // Записати у localStorage (симуляція відправки)
                const formData = {
                    name: name.value,
                    email: email.value,
                    phone: phoneInput.value,
                    message: message.value,
                    newsletter: document.getElementById('newsletter').checked,
                    timestamp: new Date().toISOString()
                };
                
                // Збереження у localStorage (для демонстрації)
                let contacts = JSON.parse(localStorage.getItem('quicktasteContacts')) || [];
                contacts.push(formData);
                localStorage.setItem('quicktasteContacts', JSON.stringify(contacts));
                
                // Відправка в Google Analytics (якщо є)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submit', {
                        'event_category': 'Contact',
                        'event_label': formData.subject
                    });
                }
            }, 1500);
        }
    });
    
    // Функції для роботи з помилками
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.add('error');
        errorElement.textContent = message;
    }
    
    function clearErrors() {
        const errorFields = document.querySelectorAll('.error');
        const errorMessages = document.querySelectorAll('.error-message');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorMessages.forEach(element => element.textContent = '');
    }
    
    // Закриття модального вікна
    function closeModal() {
        successModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    closeSuccessModal.addEventListener('click', closeModal);
    okBtn.addEventListener('click', closeModal);
    
    // Закриття модального вікна при кліку на оверлей
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });
    
    // Закриття модального вікна клавішею ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // FAQ акордеон
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Закрити всі інші відповіді
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Відкрити/закрити поточну відповідь
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
    
    // Валідація в реальному часі
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const fieldId = field.id;
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (errorElement) {
            errorElement.textContent = '';
            field.classList.remove('error');
            
            let isValid = true;
            let errorMessage = '';
            
            switch (fieldId) {
                case 'name':
                    if (!field.value.trim()) {
                        errorMessage = 'Будь ласка, введіть ваше ім\'я';
                        isValid = false;
                    } else if (field.value.trim().length < 2) {
                        errorMessage = 'Ім\'я має містити щонайменше 2 символи';
                        isValid = false;
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!field.value.trim()) {
                        errorMessage = 'Будь ласка, введіть вашу електронну пошту';
                        isValid = false;
                    } else if (!emailRegex.test(field.value)) {
                        errorMessage = 'Будь ласка, введіть коректну електронну пошту';
                        isValid = false;
                    }
                    break;
                
                    
                case 'message':
                    if (!field.value.trim()) {
                        errorMessage = 'Будь ласка, введіть ваше повідомлення';
                        isValid = false;
                    } else if (field.value.trim().length < 10) {
                        errorMessage = 'Повідомлення має містити щонайменше 10 символів';
                        isValid = false;
                    }
                    break;
            }
            
            if (!isValid) {
                errorElement.textContent = errorMessage;
                field.classList.add('error');
            }
        }
    }
    
    // Соціальні посилання
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // У реальному додатку тут будуть реальні посилання
            e.preventDefault();
            
            const platform = this.querySelector('i').className.split(' ')[1];
            const platformNames = {
                'fa-facebook': 'Facebook',
                'fa-instagram': 'Instagram',
                'fa-pinterest': 'Pinterest',
                'fa-youtube': 'YouTube',
                'fa-telegram': 'Telegram'
            };
            
            showNotification(`Перехід на ${platformNames[platform] || 'соціальну мережу'} (симуляція)`);
        });
    });
    
    // Функція для показу сповіщень
    function showNotification(message) {
        // Перевірка, чи вже є сповіщення
        let notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
        
        // Створення нового сповіщення
        notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Стилі для сповіщення
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #e74c3c;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            font-weight: 600;
            animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
            max-width: 300px;
       ` ;
        
        // Додавання анімацій
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Видалення сповіщення через 3 секунди
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Ініціалізація форми
    clearErrors();
});
