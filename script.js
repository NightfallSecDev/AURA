document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
        // Subtle 3D movement effect on hover
        card.addEventListener('mousemove', (e) => {
            // Only apply effect if not flipped
            if (!card.classList.contains('flipped')) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation based on cursor position
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                const inner = card.querySelector('.card-inner');
                // Temporarily disable transition for smooth tracking
                inner.style.transition = 'none';
                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        // Reset transform when mouse leaves
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.card-inner');
            inner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)';
            if (!card.classList.contains('flipped')) {
                inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
            }
        });
        
        // Ensure inline transform is cleared when clicking so the class can take over
        card.addEventListener('click', () => {
            const inner = card.querySelector('.card-inner');
            inner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)';
            inner.style.transform = ''; 
        });

        // Prevent the add to cart button from flipping the card back immediately
        const addToCartBtn = card.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop event bubbling to card
            });
        }
    });

    // Buttery Smooth Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('.hero-content, .category-card, .bento-card, .trust-badges, .promo-banner, .review-card, .form-container, .single-product-container, .product-image, .product-details, .section-subtext, .products-layout, .page-title, .split-layout, .fade-up');
    
    animateElements.forEach((el, index) => {
        el.classList.add('fade-up');
        // Add slight delay based on index for a cascading effect
        el.style.transitionDelay = `${(index % 5) * 0.1}s`;
        observer.observe(el);
    });
    // Image Gallery Swapping
    window.swapImage = function(thumbnail) {
        // Update main image src
        const mainImg = document.getElementById('mainProductImage');
        if(mainImg) {
            mainImg.src = thumbnail.src;
            // Transfer any inline filters if present (for our mocked images)
            mainImg.style.filter = thumbnail.style.filter;
            
            // Manage active state
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active-thumb'));
            thumbnail.classList.add('active-thumb');
            
            // Small buttery pop animation
            mainImg.style.transform = 'scale(0.98)';
            setTimeout(() => {
                mainImg.style.transform = 'scale(1)';
            }, 150);
        }
    };

    // Variant Selection (Colors / Sizes)
    window.selectVariant = function(element, className) {
        document.querySelectorAll(`.${className}`).forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    };

    // Urgency Countdown Timer
    const timerElement = document.getElementById('countdownTimer');
    if (timerElement) {
        // Mock countdown from 2 hours 45 mins
        let time = 2 * 3600 + 45 * 60; 
        
        setInterval(() => {
            if (time > 0) {
                time--;
                let hours = Math.floor(time / 3600);
                let mins = Math.floor((time % 3600) / 60);
                let secs = time % 60;
                
                hours = hours < 10 ? "0" + hours : hours;
                mins = mins < 10 ? "0" + mins : mins;
                secs = secs < 10 ? "0" + secs : secs;
                
                timerElement.innerText = `${hours}:${mins}:${secs}`;
            }
        }, 1000);
    }

    // Product Accordion Logic
    window.toggleAccordion = function(button) {
        const item = button.parentElement;
        const content = button.nextElementSibling;
        const icon = button.querySelector('.icon');
        
        // Toggle current item
        if (item.classList.contains('active')) {
            item.classList.remove('active');
            content.style.maxHeight = null;
            content.style.paddingBottom = "0";
            icon.innerText = '+';
        } else {
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.accordion-content');
                if (otherContent) {
                    otherContent.style.maxHeight = null;
                    otherContent.style.paddingBottom = "0";
                }
                const otherIcon = otherItem.querySelector('.icon');
                if (otherIcon) otherIcon.innerText = '+';
            });
            
            item.classList.add('active');
            // Slight delay to allow display to register if needed, though max-height handles it
            content.style.maxHeight = content.scrollHeight + 40 + "px"; // added buffer for padding
            content.style.paddingBottom = "20px";
            icon.innerText = '−';
        }
    };
});
