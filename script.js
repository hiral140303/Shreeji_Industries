// Main JavaScript file for TechManufacture Pro website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Mobile menu functionality
    initMobileMenu();
    
    // Navbar scroll effect
    initNavbarScroll();
    
    // Counter animations
    initCounters();
    
    // Product filtering
    initProductFiltering();
    
    // Form handling
    initFormHandling();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // WhatsApp button functionality
    initWhatsAppButtons();
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    console.log('TechManufacture Pro website initialized successfully');
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
            
            // Change menu icon
            const icon = mobileMenuBtn.querySelector('[data-lucide]');
            if (icon) {
                const isOpen = !mobileMenu.classList.contains('hidden');
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                
                const icon = mobileMenuBtn.querySelector('[data-lucide]');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        });
    }
}

/**
 * Navbar Scroll Effect
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

/**
 * Counter Animations
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    };
    
    // Use Intersection Observer to trigger counters when visible
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

/**
 * Product Filtering
 */
function initProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    
    if (filterButtons.length > 0 && productItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter products
                productItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.classList.remove('hidden');
                        item.style.display = 'block';
                    } else {
                        item.classList.add('hidden');
                        setTimeout(() => {
                            if (item.classList.contains('hidden')) {
                                item.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            });
        });
    }
}

/**
 * Form Handling
 */
function initFormHandling() {
    const inquiryForm = document.getElementById('inquiry-form');
    
    if (inquiryForm) {
        // Add form validation
        const requiredFields = inquiryForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Form submission
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual submission)
                setTimeout(() => {
                    showSuccessMessage();
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 2000);
            }
        });
    }
}

/**
 * Field Validation
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    } else {
        field.style.borderColor = '';
    }
    
    return isValid;
}

/**
 * Success Message Display
 */
function showSuccessMessage() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.querySelector('.bg-white').classList.add('success-message');
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Global function for form submission (called from HTML)
function submitForm() {
    // This function is called when the form is submitted to Google Forms
    window.alert()
    setTimeout(() => {
        showSuccessMessage();
        document.getElementById('inquiry-form').reset();
    }, 1000);
}

/**
 * Smooth Scrolling
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * WhatsApp Button Functionality
 */
function initWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add analytics tracking if needed
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    event_category: 'engagement',
                    event_label: 'WhatsApp Contact'
                });
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-slide-up, .feature-card, .product-card');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            // Set initial state for elements that will be animated
            if (!element.classList.contains('animate-slide-up')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s ease-out';
            }
            
            observer.observe(element);
        });
    }
}

/**
 * Utility Functions
 */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Performance monitoring
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        
        // You can send this data to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'load',
                value: loadTime
            });
        }
    }
});

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}