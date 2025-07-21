// Monteville Supplies & Services Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNavigation();
    initSmoothScrolling();
    initFormValidation();
    initScrollSpy();
    initHeaderScroll();
    initLogoInteractions();
    fixFormElements();
});

// Fix form elements functionality
function fixFormElements() {
    // Fix service dropdown
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        // Ensure dropdown is properly initialized
        serviceSelect.style.cursor = 'pointer';
        
        // Add event listener to ensure it works
        serviceSelect.addEventListener('change', function() {
            console.log('Service selected:', this.value);
        });
        
        // Fix for any CSS that might be interfering
        serviceSelect.addEventListener('click', function(e) {
            // Ensure the dropdown opens
            e.stopPropagation();
            this.focus();
        });
    }
    
    // Fix form input persistence
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Ensure input value persists
            this.setAttribute('value', this.value);
        });
        
        input.addEventListener('change', function() {
            // Additional persistence for dropdowns and other elements
            if (this.type === 'select-one') {
                this.setAttribute('value', this.value);
            }
        });
    });
}

// Logo Interactions
function initLogoInteractions() {
    const headerLogo = document.querySelector('.header-logo');
    
    if (headerLogo) {
        // Enhanced hover effects for header logo
        headerLogo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        headerLogo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Smooth scroll to top when header logo is clicked
        headerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('show');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('show')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors or just "#"
            if (!href || href === '#') {
                // For logo or home links, scroll to top
                if (this.classList.contains('header-logo') || href === '#' || href === '#home') {
                    event.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                return;
            }
            
            event.preventDefault();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Validation and Submission
function initFormValidation() {
    const form = document.getElementById('inquiry-form');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const messageField = document.getElementById('message');
    const successMessage = document.getElementById('success-message');

    if (form && nameField && emailField && phoneField && messageField && successMessage) {
        // Prevent default form submission to handle with JavaScript
        form.setAttribute('onsubmit', 'return false;');
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset previous errors and hide success message
            clearErrors();
            successMessage.classList.remove('show');
            
            let isValid = true;
            
            // Validate name
            if (!nameField.value.trim()) {
                showError('name-error', 'Name is required');
                nameField.classList.add('error');
                isValid = false;
            }
            
            // Validate email
            if (!emailField.value.trim()) {
                showError('email-error', 'Email is required');
                emailField.classList.add('error');
                isValid = false;
            } else if (!isValidEmail(emailField.value)) {
                showError('email-error', 'Please enter a valid email address');
                emailField.classList.add('error');
                isValid = false;
            }
            
            // Validate phone
            if (!phoneField.value.trim()) {
                showError('phone-error', 'Phone number is required');
                phoneField.classList.add('error');
                isValid = false;
            }
            
            // Validate message
            if (!messageField.value.trim()) {
                showError('message-error', 'Message is required');
                messageField.classList.add('error');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.classList.add('loading');
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    // Clear all form errors first
                    clearErrors();
                    
                    // Reset form
                    form.reset();
                    
                    // Show success message
                    successMessage.style.display = 'block';
                    successMessage.classList.add('show');
                    
                    // Reset button state
                    submitButton.classList.remove('loading');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Scroll to success message for better visibility
                    setTimeout(() => {
                        successMessage.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 100);
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 300);
                    }, 5000);
                    
                }, 1500);
            }
        });
        
        // Clear errors on input - with improved handling
        [nameField, emailField, phoneField, messageField].forEach(field => {
            if (field) {
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                    const errorElement = document.getElementById(this.name + '-error');
                    if (errorElement) {
                        errorElement.classList.remove('show');
                    }
                });
                
                // Ensure input focus works properly
                field.addEventListener('focus', function() {
                    this.classList.remove('error');
                });
            }
        });
    } else {
        console.warn('Form validation: Some required form elements not found');
    }
}

// Helper functions for form validation
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.form-control.error');
    
    errorMessages.forEach(error => error.classList.remove('show'));
    errorFields.forEach(field => field.classList.remove('error'));
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll Spy - Highlight active navigation link
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveLink, 10);
    });
    
    // Initial call
    updateActiveLink();
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // ESC key to close mobile menu
    if (event.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu && navMenu.classList.contains('show')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('show');
        }
    }
});

// Logo accessibility enhancements
function enhanceLogoAccessibility() {
    const headerLogo = document.querySelector('.header-logo');
    const footerLogo = document.querySelector('.footer-logo');
    
    if (headerLogo) {
        // Ensure proper focus handling
        headerLogo.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

// Intersection Observer for animations (optional enhancement)
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.card, .service__card, .team__member, .logo-placeholder');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize scroll animations and logo accessibility
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    enhanceLogoAccessibility();
});

// Performance optimization for logo hover effects
function optimizeLogoPerformance() {
    const logoPlaceholders = document.querySelectorAll('.logo-placeholder');
    
    logoPlaceholders.forEach(logo => {
        // Use CSS transforms for better performance
        logo.style.willChange = 'transform';
        
        // Clean up will-change after animations
        logo.addEventListener('transitionend', function() {
            this.style.willChange = 'auto';
        });
    });
}

// Call performance optimization
document.addEventListener('DOMContentLoaded', optimizeLogoPerformance);