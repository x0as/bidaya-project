// Bidaya Main JavaScript

// ============================================
// LOADING SCREEN - FIXED
// ============================================
// This runs immediately when the page loads
(function() {
    // Try to hide loading screen as soon as possible
    function hideLoading() {
        var loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
            console.log('Loading screen hidden');
        }
    }

    // Hide immediately if DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        hideLoading();
    } else {
        // Otherwise wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            hideLoading();
        });
    }

    // Fallback: hide after 1 second no matter what
    setTimeout(hideLoading, 1000);
})();

// ============================================
// MOBILE MENU
// ============================================
function toggleMobileMenu() {
    var navLinks = document.querySelector('.nav-links');
    var toggle = document.querySelector('.mobile-menu-toggle');
    if (navLinks) {
        navLinks.classList.toggle('mobile-menu-open');
    }
    if (toggle) {
        toggle.classList.toggle('active');
    }
}

// Close mobile menu on link click
document.addEventListener('DOMContentLoaded', function() {
    var links = document.querySelectorAll('.nav-links a');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function() {
            var navLinks = document.querySelector('.nav-links');
            var toggle = document.querySelector('.mobile-menu-toggle');
            if (navLinks) {
                navLinks.classList.remove('mobile-menu-open');
            }
            if (toggle) {
                toggle.classList.remove('active');
            }
        });
    }
});

// Close mobile menu on outside click
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        var nav = document.querySelector('.navbar');
        var navLinks = document.querySelector('.nav-links');
        var toggle = document.querySelector('.mobile-menu-toggle');
        if (nav && navLinks && toggle) {
            if (!nav.contains(e.target) && navLinks.classList.contains('mobile-menu-open')) {
                navLinks.classList.remove('mobile-menu-open');
                toggle.classList.remove('active');
            }
        }
    });
});

// ============================================
// POPUP FUNCTIONS
// ============================================
function showComingSoon(featureName) {
    var popup = document.createElement('div');
    popup.className = 'coming-soon-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">🚀</div>
            <h3>Coming Soon!</h3>
            <p><strong>${featureName}</strong> is currently under development.</p>
            <p>We're working hard to bring you this exciting feature. Stay tuned!</p>
            <button onclick="closeComingSoon()" class="popup-btn">Got it!</button>
        </div>
    `;
    document.body.appendChild(popup);
    setTimeout(function() {
        popup.classList.add('show');
    }, 10);
}

function closeComingSoon() {
    var popup = document.querySelector('.coming-soon-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(function() {
            popup.remove();
        }, 300);
    }
}

function showJoinDiscordPopup(topic) {
    var popup = document.createElement('div');
    popup.className = 'coming-soon-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">💬</div>
            <h3>Join our Discord</h3>
            <p>To access <strong>${topic}</strong>, please join our Discord community.</p>
            <p>Click the button below to open the Discord invite.</p>
            <button onclick="window.open('https://discord.gg/VzKjyhTWy4','_blank')" class="popup-btn">Join Discord</button>
            <button onclick="closeJoinDiscordPopup()" class="popup-btn" style="background:transparent;border:1px solid var(--border-glass);margin-left:8px;">Close</button>
        </div>
    `;
    document.body.appendChild(popup);
    setTimeout(function() {
        popup.classList.add('show');
    }, 10);
}

function closeJoinDiscordPopup() {
    var popup = document.querySelector('.coming-soon-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(function() {
            popup.remove();
        }, 300);
    }
}

// ============================================
// STATISTICS LOADER
// ============================================
async function loadStatistics() {
    try {
        console.log('Loading statistics from MongoDB...');
        var response = await fetch('/api/get-data');
        var data = await response.json();
        
        console.log('Received data:', data);
        
        if (data && data.stats) {
            // Update student count
            var studentElement = document.getElementById('student-count');
            if (studentElement) {
                var newValue = data.stats.studentCount ? data.stats.studentCount.toLocaleString() + '+' : '2,000+';
                studentElement.textContent = newValue;
                console.log('Updated student count to:', newValue);
            }
            
            // Update country count
            var countryElement = document.getElementById('country-count');
            if (countryElement) {
                var newValue = data.stats.countryCount ? data.stats.countryCount + '+' : '50+';
                countryElement.textContent = newValue;
                console.log('Updated country count to:', newValue);
            }
            
            // Update event count
            var eventElement = document.getElementById('event-count');
            if (eventElement) {
                var newValue = data.stats.eventCount ? data.stats.eventCount + '+' : '100+';
                eventElement.textContent = newValue;
                console.log('Updated event count to:', newValue);
            }
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Keep default values if MongoDB fails
    }
}

// Load statistics when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
    // Also load after loading screen is hidden
    setTimeout(function() {
        loadStatistics();
    }, 2000);
});