// Cookie Banner
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    
    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.classList.add('show');
    }
    
    acceptCookiesBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
    });

    // Investor Modal
    const investorModal = document.getElementById('investor-modal');
    const investorOptions = document.querySelectorAll('.investor-option');
    const acceptContinueBtn = document.getElementById('accept-continue');
    let selectedInvestorType = null;

    // Show modal on page load (you can trigger this based on your logic)
    // For now, we'll show it after a delay
    setTimeout(function() {
        if (!localStorage.getItem('investorProfileSelected')) {
            investorModal.classList.add('show');
        }
    }, 1000);

    investorOptions.forEach(option => {
        option.addEventListener('click', function() {
            investorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedInvestorType = this.dataset.type;
        });
    });

    acceptContinueBtn.addEventListener('click', function() {
        if (selectedInvestorType) {
            localStorage.setItem('investorProfileSelected', selectedInvestorType);
            investorModal.classList.remove('show');
        } else {
            alert('Please select an investor profile');
        }
    });

    // Close modal when clicking outside
    investorModal.addEventListener('click', function(e) {
        if (e.target === investorModal) {
            investorModal.classList.remove('show');
        }
    });

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing!');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});
