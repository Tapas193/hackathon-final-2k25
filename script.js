// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const userMenu = document.getElementById('userMenu');
const logoutBtn = document.getElementById('logoutBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');

// Page management
const pages = document.querySelectorAll('.page');
let currentPage = 'home';
let isLoggedIn = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupAuthTabs();
    setupRewardsFilters();
    setupFAQFunctionality();
    setupHistoryFilters();
    setupSettingsToggles();
    showPage('home');
});

// Initialize application
function initializeApp() {
    // Check if user is logged in (localStorage simulation)
    isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    updateAuthState();
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Setup main event listeners
function setupEventListeners() {
    // Navigation toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            if (!isLoggedIn && (page === 'dashboard' || page === 'history' || page === 'settings')) {
                showPage('auth');
                return;
            }
            
            showPage(page);
            updateActiveNav(this);
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });

    // Auth buttons
    loginBtn.addEventListener('click', function() {
        showPage('auth');
        switchAuthTab('login');
    });

    signupBtn.addEventListener('click', function() {
        showPage('auth');
        switchAuthTab('signup');
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        logout();
    });

    // Hero buttons
    getStartedBtn.addEventListener('click', function() {
        if (isLoggedIn) {
            showPage('dashboard');
        } else {
            showPage('auth');
            switchAuthTab('signup');
        }
    });

    learnMoreBtn.addEventListener('click', function() {
        showPage('faq');
    });

    // Auth form submissions
    setupAuthForms();
}

// Show specific page
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
    }

    // Update URL without page reload
    window.history.pushState({page: pageId}, '', `#${pageId}`);
}

// Update active navigation
function updateActiveNav(activeLink) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Update authentication state
function updateAuthState() {
    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userMenu.classList.remove('hidden');
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        userMenu.classList.add('hidden');
    }
}

// Auth tab functionality
function setupAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            switchAuthTab(tabType);
        });
    });
}

function switchAuthTab(tabType) {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabType) {
            tab.classList.add('active');
        }
    });

    authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${tabType}-form`) {
            form.classList.add('active');
        }
    });
}

// Auth form handling
function setupAuthForms() {
    const loginForm = document.querySelector('#login-form form');
    const signupForm = document.querySelector('#signup-form form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });

    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleSocialLogin(this);
        });
    });
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Simulate login process
    showLoading();
    setTimeout(() => {
        hideLoading();
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', 'John Doe');
        isLoggedIn = true;
        updateAuthState();
        showNotification('Login successful!', 'success');
        showPage('dashboard');
        updateActiveNav(document.querySelector('[data-page="dashboard"]'));
    }, 1500);
}

function handleSignup() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (!agreeTerms) {
        showNotification('Please agree to the terms and conditions', 'error');
        return;
    }

    // Simulate signup process
    showLoading();
    setTimeout(() => {
        hideLoading();
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', `${firstName} ${lastName}`);
        isLoggedIn = true;
        updateAuthState();
        showNotification('Account created successfully!', 'success');
        showPage('dashboard');
        updateActiveNav(document.querySelector('[data-page="dashboard"]'));
    }, 2000);
}

function handleSocialLogin(btn) {
    const provider = btn.classList.contains('google') ? 'Google' : 'Facebook';
    showNotification(`${provider} login would be implemented here`, 'info');
}

function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    isLoggedIn = false;
    updateAuthState();
    showNotification('Logged out successfully', 'success');
    showPage('home');
    updateActiveNav(document.querySelector('[data-page="home"]'));
}

// Rewards filtering
function setupRewardsFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const rewardCards = document.querySelectorAll('.reward-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter cards
            rewardCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Reward redemption buttons
    const redeemBtns = document.querySelectorAll('.reward-card .btn-primary, .reward-item .btn-sm');
    redeemBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleRewardRedemption(this);
        });
    });
}

function handleRewardRedemption(btn) {
    const rewardCard = btn.closest('.reward-card') || btn.closest('.reward-item');
    const rewardName = rewardCard.querySelector('h3, p').textContent;
    
    if (confirm(`Are you sure you want to redeem: ${rewardName}?`)) {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification('Reward redeemed successfully!', 'success');
            updatePointsDisplay();
        }, 1500);
    }
}

// FAQ functionality
function setupFAQFunctionality() {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSearch = document.getElementById('faqSearch');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            item.classList.toggle('active');
        });
    });

    // FAQ search
    if (faqSearch) {
        faqSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            faqItems.forEach(item => {
                const question = item.querySelector('h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // FAQ categories
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active category
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter FAQ items
            faqItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// History filtering
function setupHistoryFilters() {
    const historyFilter = document.getElementById('historyFilter');
    const periodFilter = document.getElementById('periodFilter');

    if (historyFilter) {
        historyFilter.addEventListener('change', function() {
            filterHistoryTable();
        });
    }

    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            filterHistoryTable();
        });
    }
}

function filterHistoryTable() {
    const historyType = document.getElementById('historyFilter').value;
    const period = document.getElementById('periodFilter').value;
    
    showNotification(`Filtering by: ${historyType} for ${period}`, 'info');
    
    // In a real app, this would make an API call to filter the data
    // For demo purposes, we'll just show a notification
}

// Settings toggles
function setupSettingsToggles() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    const editBtn = document.querySelector('.edit-btn');
    const actionBtns = document.querySelectorAll('.action-btn');

    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.closest('.setting-item').querySelector('h4').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`${setting} ${status}`, 'info');
        });
    });

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            toggleProfileEdit();
        });
    }

    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent;
            handleAccountAction(action);
        });
    });
}

function toggleProfileEdit() {
    const inputs = document.querySelectorAll('.profile-form input');
    const editBtn = document.querySelector('.edit-btn');
    
    const isEditing = editBtn.textContent === 'Save';
    
    if (isEditing) {
        // Save changes
        inputs.forEach(input => input.setAttribute('readonly', true));
        editBtn.textContent = 'Edit';
        showNotification('Profile updated successfully!', 'success');
    } else {
        // Enable editing
        inputs.forEach(input => input.removeAttribute('readonly'));
        editBtn.textContent = 'Save';
    }
}

function handleAccountAction(action) {
    switch(action) {
        case 'Change Password':
            showNotification('Password change form would open here', 'info');
            break;
        case 'Download My Data':
            showNotification('Preparing your data for download...', 'info');
            break;
        case 'Export Transaction History':
            showNotification('Exporting transaction history...', 'info');
            break;
        case 'Delete Account':
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                showNotification('Account deletion initiated', 'error');
            }
            break;
        default:
            showNotification(`${action} clicked`, 'info');
    }
}

// Utility functions
function updatePointsDisplay() {
    const pointsNumbers = document.querySelectorAll('.points-number');
    pointsNumbers.forEach(el => {
        const currentPoints = parseInt(el.textContent.replace(',', ''));
        const newPoints = Math.max(0, currentPoints - 100); // Simulate point deduction
        el.textContent = newPoints.toLocaleString();
    });
}

function showLoading() {
    document.body.style.cursor = 'wait';
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
}

function hideLoading() {
    document.body.style.cursor = 'default';
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = false);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    // Add to body
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));

    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
    `;

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#667eea';
    }
}

// Handle browser back/forward
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
        showPage(e.state.page);
        updateActiveNav(document.querySelector(`[data-page="${e.state.page}"]`));
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dashboard interactions
function setupDashboardInteractions() {
    // Points card interaction
    const pointsCard = document.querySelector('.points-card .btn-primary');
    if (pointsCard) {
        pointsCard.addEventListener('click', function() {
            showPage('rewards');
            updateActiveNav(document.querySelector('[data-page="rewards"]'));
        });
    }

    // Activity view all
    const viewAllActivity = document.querySelector('.activity-card .view-all');
    if (viewAllActivity) {
        viewAllActivity.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('history');
            updateActiveNav(document.querySelector('[data-page="history"]'));
        });
    }

    // Rewards view all
    const viewAllRewards = document.querySelector('.rewards-card .view-all');
    if (viewAllRewards) {
        viewAllRewards.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('rewards');
            updateActiveNav(document.querySelector('[data-page="rewards"]'));
        });
    }
}

// Initialize dashboard interactions after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setupDashboardInteractions();
});

// Enhanced mobile navigation
function setupMobileNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && !navMenu.classList.contains('active')) {
                // Swipe right - open menu
                navMenu.classList.add('active');
            } else if (swipeDistance < 0 && navMenu.classList.contains('active')) {
                // Swipe left - close menu
                navMenu.classList.remove('active');
            }
        }
    }
}

// Initialize mobile navigation
setupMobileNavigation();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
    
    // Alt + number keys for quick navigation
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showPage('home');
                break;
            case '2':
                e.preventDefault();
                if (isLoggedIn) showPage('dashboard');
                break;
            case '3':
                e.preventDefault();
                if (isLoggedIn) showPage('rewards');
                break;
            case '4':
                e.preventDefault();
                if (isLoggedIn) showPage('history');
                break;
            case '5':
                e.preventDefault();
                showPage('faq');
                break;
            case '6':
                e.preventDefault();
                if (isLoggedIn) showPage('settings');
                break;
        }
    }
});

// Analytics simulation
function trackEvent(eventName, properties = {}) {
    console.log('Analytics Event:', eventName, properties);
    // In a real app, this would send data to analytics service
}

// Track page views
function trackPageView(page) {
    trackEvent('page_view', { page: page });
}

// Enhanced page showing with analytics
const originalShowPage = showPage;
showPage = function(pageId) {
    originalShowPage(pageId);
    trackPageView(pageId);
};

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page Load Time:', pageLoadTime + 'ms');
                trackEvent('performance', { page_load_time: pageLoadTime });
            }, 0);
        });
    }
}

measurePerformance();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Service worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        console.log('Service Worker support detected');
        // In a real app, register service worker here
    });
}

console.log('OmniRewards App Initialized Successfully! 🎉');
console.log('Keyboard shortcuts:');
console.log('- Alt+1: Home');
console.log('- Alt+2: Dashboard');
console.log('- Alt+3: Rewards');
console.log('- Alt+4: History');
console.log('- Alt+5: FAQ');
console.log('- Alt+6: Settings');
console.log('- Escape: Close mobile menu');
