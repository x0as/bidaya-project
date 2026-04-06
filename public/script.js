// Bidaya Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Bidaya website loaded successfully!');
    
    // Initialize all functions
    initLoadingScreen();
    initNavigation();
    initScrollEffects();
    initFormHandling();
    initButtonActions();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    
    // Only initialize if loading screen exists (not all pages have it)
    if (!loadingScreen) {
        return;
    }
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.remove();
            }
        }, 500);
    }, 2000);
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.offsetTop - 80; // Account for navbar height
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Scroll Effects
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for fade-in animation
    const sections = document.querySelectorAll('section, .about-card, .event-card, .stat-item');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Form Handling
// Note: Contact form now uses FormSubmit.co for direct email submissions (no MongoDB backend needed)
// FormSubmit handles the submission directly via HTML form action attribute
function initFormHandling() {
    // Add visual focus effects to form inputs for better UX
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Button Actions
function initButtonActions() {
    // "Join Us" and "Start Your Journey" buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.join-btn, .btn-primary')) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focus on first form input after scroll
                setTimeout(() => {
                    const firstInput = document.querySelector('.contact-form input');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
            }
        }
        
        // "Learn More" button
        if (e.target.matches('.btn-secondary')) {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Success Message
function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF8A00 0%, #FF0080 30%, #8000FF 70%, #00FFFF 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.5s ease;
        backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 2rem;">🎉</span>
            <div>
                <h4 style="margin: 0 0 0.5rem 0; font-weight: 700;">Welcome to Bidaya!</h4>
                <p style="margin: 0; opacity: 0.9;">Thank you for joining our community. We'll be in touch soon!</p>
            </div>
            <button style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0; margin-left: auto; opacity: 0.8;" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.5s ease reverse';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 500);
        }
    }, 5000);
}

// Error Message
function showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.5s ease;
        backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 2rem;">❌</span>
            <div>
                <h4 style="margin: 0 0 0.5rem 0; font-weight: 700;">Submission Failed</h4>
                <p style="margin: 0; opacity: 0.9;">${message}</p>
            </div>
            <button style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0; margin-left: auto; opacity: 0.8;" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.5s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 5000);
}

// Floating Cards Animation Enhancement
function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.float-card');
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse movement for subtle card interaction
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    
    // Add subtle mouse following effect
    function animateCards() {
        floatingCards.forEach((card, index) => {
            const intensity = 0.02 + (index * 0.01);
            const currentTransform = card.style.transform || '';
            const baseTransform = currentTransform.replace(/translate\([^)]*\)/g, '');
            
            const newX = mouseX * intensity * 10;
            const newY = mouseY * intensity * 10;
            
            card.style.transform = `translate(${newX}px, ${newY}px) ${baseTransform}`;
        });
        
        requestAnimationFrame(animateCards);
    }
    
    if (floatingCards.length > 0) {
        animateCards();
    }
}

// Counter Animation with JSONBin API
async function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .stat-big');
    
    // Load data from JSONBin API
    let data = {};
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/67104baeacd3cb34a8a00592/latest', {
            headers: {
                'X-Master-Key': '$2a$10$ej5VD4T8z2K6x5iuYZQ8.OF/OaYjHjb7FMX4YNQJMG3JkGZJy.kxa'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const jsonData = result.record;
            data = {
                studentCount: jsonData.stats.studentCount || 250,
                countryCount: jsonData.stats.countryCount || 50,
                eventCount: jsonData.stats.eventCount || 100
            };
            console.log('Using data from JSONBin API');
        } else {
            throw new Error('JSONBin API failed');
        }
    } catch (error) {
        console.log('Failed to load from API, using default values');
        data = {
            studentCount: 250,
            countryCount: 50,
            eventCount: 100
        };
    }
    
    for (let counter of counters) {
        // Skip animation for "24/7" text
        if (counter.textContent.includes('24/7')) {
            continue;
        }
        
        let target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        
        // Check which counter this is and use appropriate data
        const statLabel = counter.parentElement.querySelector('.stat-label');
        if (statLabel) {
            if (statLabel.textContent.includes('Students Estimated')) {
                target = data.studentCount || 250;
            } else if (statLabel.textContent.includes('Countries')) {
                target = data.countryCount || 50;
            } else if (statLabel.textContent.includes('Events')) {
                target = data.eventCount || 100;
            }
        }
        
        const duration = 2000;
        const start = performance.now();
        const suffix = counter.textContent.replace(/[\d,]/g, '');
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            counter.textContent = formatNumber(current) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
}

// Utility function to format numbers
function formatNumber(num) {
    return num.toLocaleString();
}

// Initialize floating cards and counter animations when page loads
window.addEventListener('load', () => {
    initFloatingCards();
    
    // Trigger counter animation when stats section comes into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    const communityStats = document.querySelector('.community-stats');
    
    if (statsSection) statsObserver.observe(statsSection);
    if (communityStats) statsObserver.observe(communityStats);
});

// Performance optimizations
const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
};

// Error handling
window.addEventListener('error', function(e) {
    console.warn('⚠️ Bidaya Website Error:', e.error);
});

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
    // Escape key functionality (if needed for modals later)
    if (e.key === 'Escape') {
        // Close any open modals or notifications
        const notifications = document.querySelectorAll('[style*="position: fixed"]');
        notifications.forEach(notification => {
            if (notification.remove) notification.remove();
        });
    }
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.toggle('mobile-menu-open');
    mobileToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('mobile-menu-open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking on a link
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-links a')) {
        const navLinks = document.querySelector('.nav-links');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        navLinks.classList.remove('mobile-menu-open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (!navbar.contains(e.target) && navLinks.classList.contains('mobile-menu-open')) {
        navLinks.classList.remove('mobile-menu-open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 768) {
        navLinks.classList.remove('mobile-menu-open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLoadingScreen,
        initNavigation,
        showSuccessMessage,
        formatNumber,
        throttle,
        toggleMobileMenu
    };
}