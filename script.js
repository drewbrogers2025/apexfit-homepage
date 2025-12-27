/**
 * APEXFIT Homepage - Interactive JavaScript
 * Complete E-commerce Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initSearch();
    initMobileMenu();
    initCart();
    initProductCards();
    initCarousel();
    initNewsletter();
    initScrollEffects();
});

/**
 * Navigation Module
 * Handles mega menu and navigation interactions
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const link = item.querySelector('a');
        const menu = item.querySelector('.mega-menu');

        if (menu) {
            // Show mega menu on hover
            item.addEventListener('mouseenter', () => {
                menu.style.pointerEvents = 'auto';
            });

            item.addEventListener('mouseleave', () => {
                menu.style.pointerEvents = 'none';
            });
        }
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Search Module
 * Handles search overlay functionality
 */
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchForm = document.querySelector('.search-form');
    const searchInput = searchForm?.querySelector('input');

    function openSearch() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            searchInput?.focus();
        }, 100);
    }

    function closeSearch() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    searchToggle?.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', closeSearch);
    searchOverlay?.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });

    searchForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput?.value.trim();
        if (query) {
            console.log('Search query:', query);
            closeSearch();
            showNotification(`Searching for "${query}"...`, 'info');
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
            closeSearch();
        }
    });
}

/**
 * Mobile Menu Module
 * Handles mobile navigation
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavToggles = document.querySelectorAll('.mobile-nav-toggle');

    function openMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle?.addEventListener('click', openMenu);
    mobileMenuClose?.addEventListener('click', closeMenu);

    // Mobile nav accordions
    mobileNavToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const isActive = content.classList.contains('active');

            // Close all other accordions
            document.querySelectorAll('.mobile-nav-content').forEach(c => {
                c.classList.remove('active');
            });
            document.querySelectorAll('.mobile-nav-toggle').forEach(t => {
                t.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                content.classList.add('active');
                toggle.classList.add('active');
            }
        });
    });

    // Close menu when clicking overlay
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * Cart Module
 * Handles cart drawer and cart functionality
 */
function initCart() {
    const cartToggle = document.querySelector('.cart-toggle');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartClose = document.querySelector('.cart-close');
    const continueShopping = document.querySelector('.continue-shopping');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartFooter = document.querySelector('.cart-footer');

    // Cart state
    let cart = [];

    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    }

    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartToggle?.addEventListener('click', openCart);
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);
    continueShopping?.addEventListener('click', (e) => {
        e.preventDefault();
        closeCart();
    });

    // Expose addToCart function globally
    window.addToCart = function(product) {
        const existingItem = cart.find(item => item.id === product.id && item.size === product.size && item.color === product.color);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCartDisplay();
        updateCartCount();
        openCart();
        showNotification(`${product.title} added to cart`, 'success');
    };

    function updateCartDisplay() {
        if (cart.length === 0) {
            cartEmpty.style.display = 'flex';
            cartFooter.style.display = 'none';
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = '';
            }
        } else {
            cartEmpty.style.display = 'none';
            cartFooter.style.display = 'block';
            renderCartItems();
        }

        updateCartTotal();
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}-${item.size}-${item.color}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-variant">${item.color} / ${item.size}</p>
                    <div class="cart-item-bottom">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-id="${item.id}" data-size="${item.size}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}" data-size="${item.size}">+</button>
                        </div>
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" data-size="${item.size}">Remove</button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        cartItemsContainer.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });

        cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', handleRemoveItem);
        });
    }

    function handleQuantityChange(e) {
        const id = e.target.dataset.id;
        const size = e.target.dataset.size;
        const action = e.target.classList.contains('plus') ? 'plus' : 'minus';

        const item = cart.find(i => i.id === id && i.size === size);
        if (item) {
            if (action === 'plus') {
                item.quantity += 1;
            } else if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(i => !(i.id === id && i.size === size));
            }
            updateCartDisplay();
            updateCartCount();
        }
    }

    function handleRemoveItem(e) {
        const id = e.target.dataset.id;
        const size = e.target.dataset.size;

        cart = cart.filter(item => !(item.id === id && item.size === size));
        updateCartDisplay();
        updateCartCount();

        if (cart.length === 0) {
            showNotification('Item removed from cart', 'info');
        }
    }

    function updateCartTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const subtotalElement = document.querySelector('.subtotal-amount');
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCount) {
            if (totalItems > 0) {
                cartCount.textContent = totalItems;
                cartCount.classList.add('active');
            } else {
                cartCount.classList.remove('active');
            }
        }
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartDrawer?.classList.contains('active')) {
            closeCart();
        }
    });
}

/**
 * Product Cards Module
 * Handles quick add functionality
 */
function initProductCards() {
    const quickAddButtons = document.querySelectorAll('.quick-add-btn');

    quickAddButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest('.product-card');
            const title = card.querySelector('.product-card-title')?.textContent;
            const image = card.querySelector('.product-card-image img')?.src;
            const priceText = card.querySelector('.product-card-price')?.textContent;

            // Extract price
            const price = parseFloat(priceText?.replace(/[^0-9.]/g, '')) || 45.00;

            // Default values for demo
            const product = {
                id: card.dataset.productId || Date.now(),
                title: title || 'Product',
                price: price,
                image: image || 'images/product-1.jpg',
                color: 'Midnight Black',
                size: 'M'
            };

            // Loading state
            btn.classList.add('loading');
            btn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Success state
            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.querySelector('span').textContent = 'ADDED';

            // Add to cart
            if (typeof window.addToCart === 'function') {
                window.addToCart(product);
            }

            // Reset button
            setTimeout(() => {
                btn.classList.remove('success');
                btn.querySelector('span').textContent = 'QUICK ADD';
                btn.disabled = false;
            }, 2000);
        });
    });
}

/**
 * Carousel Module
 * Handles product carousel functionality
 */
function initCarousel() {
    const carousel = document.querySelector('.bestsellers-carousel');
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.bestsellers .carousel-btn.prev');
    const nextBtn = document.querySelector('.bestsellers .carousel-btn.next');

    if (!carousel || !track) return;

    const scrollAmount = 300;
    let isScrolling = false;

    function scrollCarousel(direction) {
        if (isScrolling) return;
        isScrolling = true;

        const currentScroll = track.scrollLeft;
        const targetScroll = currentScroll + (direction * scrollAmount);

        track.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }

    prevBtn?.addEventListener('click', () => scrollCarousel(-1));
    nextBtn?.addEventListener('click', () => scrollCarousel(1));

    // Touch/swipe support
    let touchStartX = 0;
    let scrollStartX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        scrollStartX = track.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (Math.abs(e.touches[0].clientX - touchStartX) > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    track.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            track.scrollTo({
                left: scrollStartX + (diff > 0 ? scrollAmount : -scrollAmount),
                behavior: 'smooth'
            });
        }
    }, { passive: true });

    // Mouse wheel horizontal scroll
    track.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            track.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    // Update button visibility
    function updateButtonVisibility() {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (prevBtn) {
            prevBtn.style.opacity = track.scrollLeft > 10 ? '1' : '0.5';
        }
        if (nextBtn) {
            nextBtn.style.opacity = track.scrollLeft < maxScroll - 10 ? '1' : '0.5';
        }
    }

    track.addEventListener('scroll', updateButtonVisibility);
    updateButtonVisibility();
}

/**
 * Newsletter Module
 * Handles newsletter subscription
 */
function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const email = input?.value.trim();

            if (email && isValidEmail(email)) {
                button.textContent = 'SUBSCRIBED!';
                button.disabled = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                button.style.backgroundColor = '#2e7d32';
                showNotification('Thanks for subscribing!', 'success');
                input.value = '';

                setTimeout(() => {
                    button.textContent = 'SUBSCRIBE';
                    button.style.backgroundColor = '';
                    button.disabled = false;
                }, 3000);
            } else {
                showNotification('Please enter a valid email address', 'warning');
            }
        });
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

/**
 * Scroll Effects Module
 * Handles various scroll-based interactions
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for fade-in animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    // Parallax effect for hero (subtle)
    const hero = document.querySelector('.hero-background');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }
}

/**
 * Notification System
 * Shows toast notifications
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after delay
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

/**
 * Social Links Hover Effect
 */
(function initSocialEffects() {
    const socialLinks = document.querySelectorAll('.social-links a');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
})();

/**
 * Product Card Hover Effect Enhancement
 */
(function initProductCardEffects() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = 'none';
        });
    });
})();

/**
 * Collection Cards Hover Effect
 */
(function initCollectionEffects() {
    const collectionItems = document.querySelectorAll('.collection-item');

    collectionItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '';
        });
    });
})();

/**
 * Instagram Grid Hover Effect
 */
(function initInstagramEffects() {
    const instagramItems = document.querySelectorAll('.instagram-item');

    instagramItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '';
        });
    });
})();

/**
 * Newsletter Forms Styling
 */
(function initFormStyles() {
    const inputs = document.querySelectorAll('.newsletter-form input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
})();

/**
 * Footer Links Animation
 */
(function initFooterEffects() {
    const footerLinks = document.querySelectorAll('.footer-column a');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.paddingLeft = '8px';
        });

        link.addEventListener('mouseleave', () => {
            link.style.paddingLeft = '';
        });
    });
})();

/**
 * Menu Toggle Animation
 */
(function initMenuToggleAnimation() {
    const menuToggle = document.querySelector('.menu-toggle');

    menuToggle?.addEventListener('click', function() {
        this.classList.toggle('active');
    });
})();

/**
 * Console Welcome Message
 */
console.log('%c APEXFIT ', 'background: #000; color: #fff; font-size: 24px; font-weight: bold;');
console.log('%c Premium E-commerce Experience ', 'color: #666; font-size: 12px;');
console.log('%c Welcome to the ApexFit Homepage ', 'color: #333; font-size: 14px;');