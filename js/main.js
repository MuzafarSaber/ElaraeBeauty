    document.addEventListener('DOMContentLoaded', function() {
            // ======================
            // 1. AUTO-SLIDING HERO
            // ======================
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');
            let currentSlide = 0;
            const slideInterval = 5000; // 5 seconds

            function showSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                slides[index].classList.add('active');
                dots[index].classList.add('active');
                currentSlide = index;
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showSlide(index);
                    resetTimer();
                });
            });

            let slideTimer = setInterval(nextSlide, slideInterval);

            function resetTimer() {
                clearInterval(slideTimer);
                slideTimer = setInterval(nextSlide, slideInterval);
            }

            const hero = document.querySelector('.hero');
            hero.addEventListener('mouseenter', () => clearInterval(slideTimer));
            hero.addEventListener('mouseleave', resetTimer);
            showSlide(0);

            // ======================
            // 2. MEGA MENU DROPDOWNS
            // ======================
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('mouseenter', function() {
                    this.querySelector('.mega-menu').style.display = 'block';
                });
                dropdown.addEventListener('mouseleave', function() {
                    this.querySelector('.mega-menu').style.display = 'none';
                });
            });

            // ======================
            // 3. MOBILE MENU TOGGLE
            // ======================
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.querySelector('.header .container').appendChild(mobileMenuBtn);

            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            document.body.appendChild(mobileMenu);

            function updateMobileMenu() {
                const navList = document.querySelector('.nav-list').cloneNode(true);
                navList.querySelectorAll('.mega-menu').forEach(menu => menu.remove());
                mobileMenu.innerHTML = '';
                mobileMenu.appendChild(navList);
            }

            mobileMenuBtn.addEventListener('click', function() {
                updateMobileMenu();
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });

            document.addEventListener('click', function(e) {
                if (!mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });

            // ======================
            // 4. CART FUNCTIONALITY
            // ======================
            const cartItems = [];
            const cartBtn = document.querySelector('.auth-links a:last-child');
            const cartCount = document.createElement('span');
            cartCount.className = 'cart-count';
            cartBtn.appendChild(cartCount);

            function updateCartCount() {
                cartCount.textContent = cartItems.length > 0 ? `(${cartItems.length})` : '';
            }

            function updateCartModal() {
                const cartItemsList = document.getElementById('cartItems');
                cartItemsList.innerHTML = '';
                
                if (cartItems.length === 0) {
                    cartItemsList.innerHTML = '<li>Your cart is empty</li>';
                    return;
                }

                cartItems.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${item.name} - $${item.price}
                        <button class="remove-item" data-id="${item.id}">×</button>
                    `;
                    cartItemsList.appendChild(li);
                });

                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const itemId = this.dataset.id;
                        const index = cartItems.findIndex(item => item.id === itemId);
                        if (index !== -1) {
                            cartItems.splice(index, 1);
                            updateCartCount();
                            updateCartModal();
                            showToast('Item removed from cart');
                        }
                    });
                });
            }

            // Add to cart functionality
            document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
                btn.addEventListener('click', function() {
                    const product = {
                        id: this.dataset.id,
                        name: this.dataset.name,
                        price: this.dataset.price
                    };
                    cartItems.push(product);
                    updateCartCount();
                    updateCartModal();
                    showToast(`${product.name} added to cart`);
                });
            });

            // ======================
            // 5. CART MODAL
            // ======================
            const cartModal = document.getElementById('cartModal');
            const closeModal = document.querySelector('.close-modal');

            cartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                cartModal.style.display = 'flex';
            });

            closeModal.addEventListener('click', function() {
                cartModal.style.display = 'none';
            });

            window.addEventListener('click', function(e) {
                if (e.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });

            // 6. SEARCH FUNCTIONALITY
            // ======================
            const products = [
                { 
                    id: 1, 
                    name: "Golden Radiance Serum", 
                    category: "Skincare", 
                    price: 89.99, 
                    image: "https://images.pexels.com/photos/4089997/pexels-photo-4089997.jpeg" 
                },
                { 
                    id: 2, 
                    name: "Daisy Perfume", 
                    category: "Fragrance", 
                    price: 100, 
                    image: "https://images.pexels.com/photos/1961785/pexels-photo-1961785.jpeg" 
                },
                { 
                    id: 3, 
                    name: "Luminous Foundation", 
                    category: "Makeup", 
                    price: 45.99, 
                    image: "https://images.pexels.com/photos/2732197/pexels-photo-2732197.jpeg" 
                }
            ];

            const searchInput = document.getElementById('mainSearchInput');
            const searchSuggestions = document.getElementById('searchSuggestions');
            let selectedIndex = -1;

            // Show suggestions when typing
            searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length > 1) {
                const results = products.filter(product => 
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );
                 // Position the dropdown
                const searchForm = this.closest('.modern-search-form');
                const formRect = searchForm.getBoundingClientRect();
                
                searchSuggestions.style.width = `${formRect.width}px`;
                searchSuggestions.style.left = '0';
                displaySuggestions(results);
            } else {
                searchSuggestions.style.display = 'none';
                searchInput.setAttribute('aria-expanded', 'false');
            }
        });

            // Handle form submission
            document.querySelector('.modern-search-form').addEventListener('submit', function(e) {
                e.preventDefault();
                if (selectedIndex >= 0) {
                    const items = searchSuggestions.querySelectorAll('.suggestion-item');
                    items[selectedIndex].click();
                } else {
                    performSearch(searchInput.value.trim());
                }
            });

            function performSearch(query) {
                // Implement your search logic here
                console.log("Searching for:", query);
                // window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }

            function displaySuggestions(results) {
            searchSuggestions.innerHTML = '';
            selectedIndex = -1;
            
                if (results.length === 0) {
                    searchSuggestions.innerHTML = '<div class="suggestion-item">No products found</div>';
                } else {
                    results.forEach(product => {
                        const item = document.createElement('div');
                        item.className = 'suggestion-item';
                        item.innerHTML = `
                            <img src="${product.image}" alt="${product.name}">
                            <div>
                                <div class="suggestion-text">${product.name}</div>
                                <div class="suggestion-category">${product.category}</div>
                            </div>
                            <div class="suggestion-price">$${product.price.toFixed(2)}</div>
                        `;
                        item.addEventListener('click', () => {
                            window.location.href = `/products/${product.id}`;
                            searchSuggestions.style.display = 'none';
                            searchInput.setAttribute('aria-expanded', 'false');
                        });
                        searchSuggestions.appendChild(item);
                    });
                }
                
                searchSuggestions.style.display = 'block';
                searchInput.setAttribute('aria-expanded', 'true');
            }

            // Keyboard navigation
            searchInput.addEventListener('keydown', function(e) {
                const items = searchSuggestions.querySelectorAll('.suggestion-item');
            
                if (e.key === 'Escape') {
                    searchSuggestions.style.display = 'none';
                    searchInput.setAttribute('aria-expanded', 'false');
                    return;
                }
                
                // Only handle arrows if suggestions are visible
                if (searchSuggestions.style.display !== 'block') return;
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                    updateSelection();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateSelection();
                } else if (e.key === 'Enter' && selectedIndex >= 0) {
                    e.preventDefault();
                    items[selectedIndex].click();
                }
             });

            function updateSelection() {
                const items = searchSuggestions.querySelectorAll('.suggestion-item');
                items.forEach((item, index) => {
                    item.classList.toggle('selected', index === selectedIndex);
                    if (index === selectedIndex) {
                        item.scrollIntoView({ block: 'nearest' });
                    }
                });
            }

            // Hide suggestions when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.modern-search-container')) {
                    searchSuggestions.style.display = 'none';
                    searchInput.setAttribute('aria-expanded', 'false');
                }
            });

            // ======================
            // 7. TOAST NOTIFICATIONS
            // ======================
            function showToast(message) {
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = message;
                document.body.appendChild(toast);
                
                setTimeout(() => toast.classList.add('show'), 10);
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            // ======================
            // 8. RESPONSIVE ADJUSTMENTS
            // ======================
            function handleResponsive() {
                if (window.innerWidth < 992) {
                    // Tablet/mobile behaviors
                } else {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }

            window.addEventListener('resize', handleResponsive);
            handleResponsive();

            // Initialize cart modal
            updateCartModal();
});