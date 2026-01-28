// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const chevron = this.querySelector('.fa-chevron-down');
            
            // Close other open FAQs
            faqQuestions.forEach(otherQuestion => {
                const otherFaqItem = otherQuestion.parentElement;
                const otherAnswer = otherFaqItem.querySelector('.faq-answer');
                const otherChevron = otherQuestion.querySelector('.fa-chevron-down');
                
                if (otherFaqItem !== faqItem && otherAnswer.classList.contains('active')) {
                    otherAnswer.classList.remove('active');
                    otherChevron.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current FAQ
            if (faqAnswer.classList.contains('active')) {
                faqAnswer.classList.remove('active');
                chevron.style.transform = 'rotate(0deg)';
            } else {
                faqAnswer.classList.add('active');
                chevron.style.transform = 'rotate(180deg)';
            }
        });
    });
});

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const phone = formData.get('phone').trim();
            const packageSelected = formData.get('package');
            const message = formData.get('message').trim();
            
            // Validate form
            if (!name || !email || !message) {
                showNotification('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Παρακαλώ εισάγετε έγκυρη διεύθυνση email.', 'error');
                return;
            }
            
            // Create email content
            const subject = 'Νέα Επικοινωνία από την Ιστοσελίδα';
            const body = createEmailBody(name, email, phone, packageSelected, message);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span>Αποστολή...';
            submitBtn.disabled = true;
            
            // For Gmail users, create Gmail compose URL
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@earnwise.gr&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Create fallback mailto URL
            const mailtoUrl = `mailto:info@earnwise.gr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            console.log('Form submitted successfully', { name, email, phone, packageSelected, message });
            console.log('Gmail URL:', gmailUrl);
            console.log('Mailto URL:', mailtoUrl);
            
            // Simulate processing time and open email client
            setTimeout(() => {
                // Try Gmail first (since you're logged in to Gmail)
                try {
                    window.open(gmailUrl, '_blank');
                    showNotification('Άνοιξε το Gmail με έτοιμο μήνυμα. Παρακαλώ στείλτε το email.', 'success');
                } catch (e) {
                    // Fallback to mailto
                    try {
                        const link = document.createElement('a');
                        link.href = mailtoUrl;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showNotification('Άνοιξε το email client με έτοιμο μήνυμα. Παρακαλώ στείλτε το email.', 'success');
                    } catch (e2) {
                        // Last resort - copy to clipboard
                        navigator.clipboard.writeText(`Προς: info@earnwise.gr\nΘέμα: ${subject}\n\n${body}`).then(() => {
                            showNotification('Τα στοιχεία αντιγράφηκαν στο clipboard. Επικολλήστε τα στο email σας.', 'success');
                        }).catch(() => {
                            showNotification('Παρακαλώ στείλτε email στο info@earnwise.gr με τα στοιχεία σας.', 'error');
                        });
                    }
                }
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Reset form
                this.reset();
            }, 1000);
        });
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Create email body function
function createEmailBody(name, email, phone, packageSelected, message) {
    let body = `Νέα επικοινωνία από την ιστοσελίδα:\n\n`;
    body += `Όνομα: ${name}\n`;
    body += `Email: ${email}\n`;
    
    if (phone) {
        body += `Τηλέφωνο: ${phone}\n`;
    }
    
    if (packageSelected) {
        body += `Ενδιαφέρον για πακέτο: ${packageSelected}\n`;
    }
    
    body += `\nΜήνυμα:\n${message}\n\n`;
    body += `---\n`;
    body += `Αυτό το μήνυμα στάλθηκε από τη φόρμα επικοινωνίας της ιστοσελίδας.\n`;
    body += `Παρακαλώ απαντήστε απευθείας στο email του χρήστη: ${email}`;
    
    return body;
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Allow manual close on click
    notification.addEventListener('click', () => {
        notification.remove();
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.package-column, .benefit-card, .care-item, .solution-item, .showcase-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

// Form input animations
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value.trim()) {
            input.parentElement.classList.add('focused');
        }
    });
});

// Button loading states
function addLoadingState(button, loadingText = 'Φόρτωση...') {
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="spinner"></span>${loadingText}`;
    button.disabled = true;
    
    return function removeLoadingState() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button if needed
document.addEventListener('DOMContentLoaded', function() {
    let scrollToTopBtn;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            if (!scrollToTopBtn) {
                scrollToTopBtn = document.createElement('button');
                scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
                scrollToTopBtn.className = 'scroll-to-top';
                scrollToTopBtn.onclick = scrollToTop;
                document.body.appendChild(scrollToTopBtn);
            }
            scrollToTopBtn.style.display = 'flex';
        } else if (scrollToTopBtn) {
            scrollToTopBtn.style.display = 'none';
        }
    });
});

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.log('Failed to load image:', this.src);
        });
    });
});

// Performance optimization: Lazy loading for background images
document.addEventListener('DOMContentLoaded', function() {
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    
    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                    element.classList.add('bg-loaded');
                    bgObserver.unobserve(element);
                }
            });
        });
        
        lazyBackgrounds.forEach(bg => {
            bgObserver.observe(bg);
        });
    }
});

// Console welcome message
console.log('%cPropertyBoost Landing Page', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cΑυτοματισμός για καταλύματα - Έτοιμο για παραγωγή!', 'color: #16a34a; font-size: 14px;');