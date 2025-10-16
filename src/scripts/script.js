// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(16, 20, 24, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 65, 0.3)';
    } else {
        navbar.style.background = 'rgba(16, 20, 24, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 65, 0.2)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe all sections and cards for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature, .about-text, .contact-info, .contact-form');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Security Form Validation and Email Handling
class SecureFormValidator {
    constructor() {
        this.submitAttempts = 0;
        this.lastSubmitTime = 0;
        this.rateLimitDelay = 5000; // 5 seconds between submissions
        this.maxAttempts = 3;
        this.initializeEmailJS();
        this.setupEventListeners();
    }

    initializeEmailJS() {
        // Initialize EmailJS with your public key
        // You'll need to replace this with your actual EmailJS public key
        if (typeof emailjs !== 'undefined') {
            emailjs.init("nkkkmnJjWwSPWwJL-"); // Replace with your actual public key
        }
    }

    setupEventListeners() {
        const form = document.getElementById('secureContactForm');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('[data-validate]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.dataset.validate;
        let isValid = true;
        let errorMessage = '';

        // Clear previous validation
        this.clearFieldError(field);

        switch (fieldType) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                } else if (!/^[a-zA-Z\s\-'\.]{2,100}$/.test(value)) {
                    errorMessage = 'Name contains invalid characters';
                    isValid = false;
                } else if (this.containsSuspiciousContent(value)) {
                    errorMessage = 'Invalid content detected';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                } else if (this.containsSuspiciousContent(value)) {
                    errorMessage = 'Invalid content detected';
                    isValid = false;
                }
                break;

            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                } else if (this.containsSuspiciousContent(value)) {
                    errorMessage = 'Invalid content detected';
                    isValid = false;
                }
                break;

            case 'service':
                if (!value) {
                    errorMessage = 'Please select a service';
                    isValid = false;
                } else if (!this.isValidServiceOption(value)) {
                    errorMessage = 'Invalid service selection';
                    isValid = false;
                }
                break;

            case 'message':
                if (value && this.containsSuspiciousContent(value)) {
                    errorMessage = 'Message contains prohibited content';
                    isValid = false;
                } else if (value.length > 1000) {
                    errorMessage = 'Message is too long (max 1000 characters)';
                    isValid = false;
                }
                break;
        }

        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\(\)\-\s\d]{10,20}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(phone) && cleanPhone.length >= 10;
    }

    isValidServiceOption(service) {
        const validOptions = ['network-assessment', 'penetration-testing', 'security-training'];
        return validOptions.includes(service);
    }

    containsSuspiciousContent(value) {
        // Check for common injection patterns
        const suspiciousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /onload\s*=/gi,
            /onerror\s*=/gi,
            /onclick\s*=/gi,
            /<iframe/gi,
            /<object/gi,
            /<embed/gi,
            /eval\s*\(/gi,
            /expression\s*\(/gi,
            /url\s*\(/gi,
            /import\s*\(/gi,
            /document\.cookie/gi,
            /localStorage/gi,
            /sessionStorage/gi,
            /\.innerHTML/gi,
            /\.outerHTML/gi,
            /data:text\/html/gi,
            /%3cscript/gi,
            /%3c\/script%3e/gi,
            /\x3cscript/gi,
            /\x3c\/script\x3e/gi
        ];

        return suspiciousPatterns.some(pattern => pattern.test(value));
    }

    sanitizeInput(value) {
        // Remove HTML tags and encode special characters
        return value
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }

    setFieldValidation(field, isValid, errorMessage) {
        const errorElement = document.getElementById(field.id + '-error');
        
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            if (errorElement) errorElement.textContent = '';
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            if (errorElement) errorElement.textContent = errorMessage;
        }
    }

    clearFieldError(field) {
        field.classList.remove('invalid', 'valid');
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) errorElement.textContent = '';
    }

    checkRateLimit() {
        const now = Date.now();
        const timeSinceLastSubmit = now - this.lastSubmitTime;
        
        if (this.submitAttempts >= this.maxAttempts) {
            this.showRateLimitNotice('Too many attempts. Please try again later.');
            return false;
        }
        
        if (timeSinceLastSubmit < this.rateLimitDelay) {
            const remainingTime = Math.ceil((this.rateLimitDelay - timeSinceLastSubmit) / 1000);
            this.showRateLimitNotice(`Please wait ${remainingTime} seconds before submitting again.`);
            return false;
        }
        
        return true;
    }

    showRateLimitNotice(message) {
        const form = document.getElementById('secureContactForm');
        let notice = form.querySelector('.rate-limit-notice');
        
        if (!notice) {
            notice = document.createElement('div');
            notice.className = 'rate-limit-notice';
            form.insertBefore(notice, form.firstChild);
        }
        
        notice.textContent = message;
        
        setTimeout(() => {
            if (notice.parentNode) {
                notice.remove();
            }
        }, 5000);
    }

    checkHoneypot() {
        const honeypot = document.getElementById('website');
        return !honeypot || !honeypot.value;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Check honeypot
        if (!this.checkHoneypot()) {
            console.warn('Bot detected');
            return;
        }
        
        // Check rate limiting
        if (!this.checkRateLimit()) {
            return;
        }
        
        const form = e.target;
        const inputs = form.querySelectorAll('[data-validate]');
        let isFormValid = true;
        
        // Validate all fields
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showNotification('Please correct the errors before submitting.', 'error');
            return;
        }
        
        // Update submit tracking
        this.submitAttempts++;
        this.lastSubmitTime = Date.now();
        
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        if (submitBtn && btnText && btnLoader) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            submitBtn.disabled = true;
        }
        
        // Submit via EmailJS
        this.submitWithEmailJS(form, submitBtn, btnText, btnLoader);
    }

    submitWithEmailJS(form, submitBtn, btnText, btnLoader) {
        // Collect form data
        const formData = new FormData(form);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message'),
            to_name: 'BioGlytch Team',
            reply_to: formData.get('email')
        };

        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
            this.showFallbackForm(templateParams, submitBtn, btnText, btnLoader);
            return;
        }

        // Send email via EmailJS
        emailjs.send('service_7r6krlp', 'bioglytch-studios-mail', templateParams)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                this.showSuccessMessage();
                form.reset();
                this.clearAllValidation(form);
                this.submitAttempts = 0; // Reset on success
            })
            .catch((error) => {
                console.error('EmailJS failed:', error);
                this.showFallbackForm(templateParams, submitBtn, btnText, btnLoader);
            })
            .finally(() => {
                // Reset button state
                if (btnText && btnLoader && submitBtn) {
                    btnText.style.display = 'inline';
                    btnLoader.style.display = 'none';
                    submitBtn.disabled = false;
                }
            });
    }

    showFallbackForm(templateParams, submitBtn, btnText, btnLoader) {
        // Fallback: Create a mailto link with the form data
        const subject = encodeURIComponent('New Network Assessment Lead from ' + templateParams.from_name);
        const body = encodeURIComponent(`
Name: ${templateParams.from_name}
Email: ${templateParams.from_email}
Phone: ${templateParams.phone || 'Not provided'}
Service: ${templateParams.service}
Message: ${templateParams.message}

This message was sent from the BioGlytch contact form.
        `.trim());
        
        const mailtoLink = `mailto:bioglytch.cyber@gmail.com?subject=${subject}&body=${body}`;
        
        // Reset button state
        if (btnText && btnLoader && submitBtn) {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
        
        // Show fallback message and open email client
        this.showNotification('Opening your email client to send the message...', 'info');
        window.location.href = mailtoLink;
    }

    clearAllValidation(form) {
        const inputs = form.querySelectorAll('[data-validate]');
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
            const errorElement = document.getElementById(input.id + '-error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }

    showSuccessMessage() {
        const form = document.getElementById('secureContactForm');
        let successMsg = form.querySelector('.success-message');
        
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            form.insertBefore(successMsg, form.firstChild);
        }
        
        successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! We\'ll get back to you soon.';
        
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.remove();
            }
        }, 5000);
    }

    showNotification(message, type = 'error') {
        // Use the global notification system
        showNotification(message, type);
    }
}

// Initialize secure form validator
document.addEventListener('DOMContentLoaded', () => {
    new SecureFormValidator();
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
        default:
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    notification.innerHTML = `${icon}${message}`;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}
