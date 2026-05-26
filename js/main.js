/**
 * Netflowautostack.com - Main JavaScript
 * Tesla-inspired interactive website with rich animations
 */

(function() {
    'use strict';

    // ==================== DOM Elements ====================
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // ==================== Header Scroll Effect ====================
    function handleHeaderScroll() {
        if (!header) return;
        
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ==================== Mobile Navigation ====================
    function toggleMobileNav() {
        if (!menuToggle || !mobileNav) return;
        
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent body scroll when mobile nav is open
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileNav() {
        if (!menuToggle || !mobileNav) return;
        
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ==================== Scroll Animations ====================
    function initScrollAnimations() {
        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Optional: unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    // ==================== Smooth Scroll ====================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile nav if open
                    closeMobileNav();
                }
            });
        });
    }

    // ==================== Counter Animation ====================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        if (!counters.length) return;

        const observerOptions = {
            root: null,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.getAttribute('data-counter'), 10);
                    animateCounter(entry.target, target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    // ==================== Parallax Effect ====================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (!parallaxElements.length) return;

        function updateParallax() {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const offset = scrollY * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }

        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    // ==================== Form Handling ====================
    function initForms() {
        const forms = document.querySelectorAll('form[data-ajax]');
        
        forms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.textContent : '';
                
                // Show loading state
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }
                
                // Collect form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Simulate API call (replace with actual endpoint)
                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Success
                    showNotification('Thank you! Your message has been sent successfully.', 'success');
                    form.reset();
                } catch (error) {
                    // Error
                    showNotification('Something went wrong. Please try again.', 'error');
                } finally {
                    // Reset button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }
                }
            });
        });
    }

    // ==================== Notification System ====================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">
                    ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
                </span>
                <span class="notification__message">${message}</span>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 9999;
                    padding: 16px 24px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    animation: slideIn 0.3s ease-out;
                }
                .notification--success { border-left: 4px solid #10b981; }
                .notification--error { border-left: 4px solid #ef4444; }
                .notification--info { border-left: 4px solid #3b82f6; }
                .notification__content { display: flex; align-items: center; gap: 12px; }
                .notification__icon { 
                    width: 24px; height: 24px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 14px; color: white;
                }
                .notification--success .notification__icon { background: #10b981; }
                .notification--error .notification__icon { background: #ef4444; }
                .notification--info .notification__icon { background: #3b82f6; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // ==================== Active Navigation ====================
    function setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.header__nav-link, .mobile-nav__link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || 
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith(href))) {
                link.classList.add('active');
            }
        });
    }

    // ==================== Lazy Loading Images ====================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (!lazyImages.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ==================== Tabs Component ====================
    function initTabs() {
        const tabContainers = document.querySelectorAll('[data-tabs]');
        
        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('[data-tab]');
            const panels = container.querySelectorAll('[data-panel]');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetId = tab.getAttribute('data-tab');
                    
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Update active panel
                    panels.forEach(panel => {
                        if (panel.getAttribute('data-panel') === targetId) {
                            panel.classList.add('active');
                        } else {
                            panel.classList.remove('active');
                        }
                    });
                });
            });
        });
    }

    // ==================== Accordion Component ====================
    function initAccordion() {
        const accordions = document.querySelectorAll('[data-accordion]');
        
        accordions.forEach(accordion => {
            const items = accordion.querySelectorAll('[data-accordion-item]');
            
            items.forEach(item => {
                const header = item.querySelector('[data-accordion-header]');
                const content = item.querySelector('[data-accordion-content]');
                
                if (header && content) {
                    header.addEventListener('click', () => {
                        const isOpen = item.classList.contains('open');
                        
                        // Close all items
                        items.forEach(i => {
                            i.classList.remove('open');
                            const c = i.querySelector('[data-accordion-content]');
                            if (c) c.style.maxHeight = '0';
                        });
                        
                        // Toggle current item
                        if (!isOpen) {
                            item.classList.add('open');
                            content.style.maxHeight = content.scrollHeight + 'px';
                        }
                    });
                }
            });
        });
    }

    // ==================== Back to Top Button ====================
    function initBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');
        
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==================== Copy to Clipboard ====================
    function initCopyToClipboard() {
        const copyButtons = document.querySelectorAll('[data-copy]');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const targetId = button.getAttribute('data-copy');
                const targetElement = document.getElementById(targetId) || 
                                     button.closest('[data-copy-container]')?.querySelector(targetId);
                
                if (targetElement) {
                    const text = targetElement.textContent || targetElement.value;
                    
                    try {
                        await navigator.clipboard.writeText(text);
                        showNotification('Copied to clipboard!', 'success');
                    } catch (err) {
                        showNotification('Failed to copy', 'error');
                    }
                }
            });
        });
    }

    // ==================== Initialize Everything ====================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupEventListeners);
        } else {
            setupEventListeners();
        }
    }

    function setupEventListeners() {
        // Header scroll
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Initial check

        // Mobile navigation
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileNav);
        }

        // Close mobile nav on link click
        document.querySelectorAll('.mobile-nav__link').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        // Close mobile nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileNav();
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav && mobileNav.classList.contains('active')) {
                if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    closeMobileNav();
                }
            }
        });

        // Initialize components
        initScrollAnimations();
        initSmoothScroll();
        initCounters();
        initParallax();
        initForms();
        initLazyLoading();
        initTabs();
        initAccordion();
        initBackToTop();
        initCopyToClipboard();
        setActiveNavigation();
    }

    // Start the application
    init();

})();
