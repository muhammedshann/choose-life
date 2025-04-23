document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.getElementById('mainNav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Statistics counter animation
    const statElements = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateStats() {
        if (animated) return;
        
        const statsContainer = document.querySelector('.stats-container');
        if (!statsContainer) return;
        
        const statsPosition = statsContainer.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (statsPosition < screenPosition) {
            statElements.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                let count = 0;
                const duration = 2000; // 2 seconds
                const interval = duration / target;
                
                const counter = setInterval(() => {
                    count += 1;
                    stat.textContent = count;
                    
                    if (count >= target) {
                        clearInterval(counter);
                    }
                }, interval);
            });
            
            animated = true;
        }
    }

    window.addEventListener('scroll', animateStats);

    // Warning cards flip functionality
    const warningCards = document.querySelectorAll('.warning-card');
    warningCards.forEach(card => {
        card.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
            }
        });
    });

    // Self-assessment functionality
    const assessmentForm = document.getElementById('assessmentForm');
    const assessmentSubmit = document.getElementById('assessmentSubmit');
    const assessmentResults = document.getElementById('assessmentResults');
    const resultContent = document.getElementById('resultContent');
    const resetAssessment = document.getElementById('resetAssessment');

    if (assessmentSubmit) {
        assessmentSubmit.addEventListener('click', function() {
            // Check if all questions are answered
            const questions = assessmentForm.querySelectorAll('.assessment-question');
            let allAnswered = true;
            let score = 0;
            
            questions.forEach(question => {
                const questionNumber = question.getAttribute('data-question');
                const answered = assessmentForm.querySelector(`input[name="q${questionNumber}"]:checked`);
                
                if (!answered) {
                    allAnswered = false;
                    question.classList.add('unanswered');
                } else {
                    question.classList.remove('unanswered');
                    score += parseInt(answered.value);
                }
            });
            
            if (!allAnswered) {
                alert('Please answer all questions to see your results.');
                return;
            }
            
            // Display results based on score
            let resultMessage = '';
            let resultClass = '';
            
            if (score <= 1) {
                resultMessage = `
                    <p>Your responses suggest a <strong>low risk</strong> of substance use concerns. However, it's important to stay informed about substance use and its potential impacts.</p>
                    <p>Recommendations:</p>
                    <ul>
                        <li>Continue to make informed choices about substance use</li>
                        <li>Stay educated about the risks associated with drugs and alcohol</li>
                        <li>Maintain healthy coping strategies for stress</li>
                    </ul>
                `;
                resultClass = 'low-risk';
            } else if (score <= 3) {
                resultMessage = `
                    <p>Your responses suggest a <strong>moderate risk</strong> of substance use concerns. It may be beneficial to evaluate your relationship with substances.</p>
                    <p>Recommendations:</p>
                    <ul>
                        <li>Consider speaking with a healthcare provider about your substance use</li>
                        <li>Be mindful of situations that may trigger increased use</li>
                        <li>Explore healthy alternatives for stress management</li>
                    </ul>
                `;
                resultClass = 'moderate-risk';
            } else {
                resultMessage = `
                    <p>Your responses suggest a <strong>high risk</strong> of substance use concerns. It's recommended that you speak with a healthcare professional about your substance use.</p>
                    <p>Recommendations:</p>
                    <ul>
                        <li>Reach out to a healthcare provider or addiction specialist</li>
                        <li>Consider calling SAMHSA's helpline at 1-800-662-HELP (4357)</li>
                        <li>Connect with support groups in your area</li>
                        <li>Remember that seeking help is a sign of strength, not weakness</li>
                    </ul>
                `;
                resultClass = 'high-risk';
            }
            
            resultContent.innerHTML = resultMessage;
            resultContent.className = resultClass;
            assessmentForm.style.display = 'none';
            assessmentResults.classList.remove('d-none');
        });
    }

    if (resetAssessment) {
        resetAssessment.addEventListener('click', function() {
            assessmentForm.reset();
            assessmentForm.style.display = 'block';
            assessmentResults.classList.add('d-none');
            
            // Remove any unanswered highlights
            const questions = assessmentForm.querySelectorAll('.assessment-question');
            questions.forEach(question => {
                question.classList.remove('unanswered');
            });
        });
    }

    // Share story form submission
    const storyForm = document.getElementById('storyForm');
    const submitStory = document.getElementById('submitStory');
    const shareStoryModal = document.getElementById('shareStoryModal');
    const successModal = document.getElementById('successModal');

    if (submitStory) {
        submitStory.addEventListener('click', function() {
            const name = document.getElementById('storyName').value || 'Anonymous';
            const recoveryTime = document.getElementById('recoveryTime').value;
            const storyContent = document.getElementById('storyContent').value;
            const consent = document.getElementById('storyConsent').checked;
            
            if (!recoveryTime || !storyContent || !consent) {
                alert('Please fill in all required fields and provide consent.');
                return;
            }
            
            // In a real application, you would send this data to a server
            console.log('Story submitted:', {
                name,
                recoveryTime,
                storyContent
            });
            
            // Reset form and show success message
            storyForm.reset();
            
            // Close the share story modal and show success modal
            const bsShareStoryModal = bootstrap.Modal.getInstance(shareStoryModal);
            bsShareStoryModal.hide();
            
            // Show success modal
            const bsSuccessModal = new bootstrap.Modal(successModal);
            bsSuccessModal.show();
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // In a real application, you would send this data to a server
            console.log('Newsletter subscription:', email);
            
            // Reset form and show success message
            this.reset();
            alert('Thank you for subscribing to our newsletter!');
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Accessibility improvements - make sure all interactive elements are keyboard accessible
    document.querySelectorAll('.warning-card, .info-card, .strategy-card, .emergency-card').forEach(card => {
        if (!card.getAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
    });

    // Initialize Bootstrap modals (moved to ensure bootstrap is available)
    const shareStoryModalEl = document.getElementById('shareStoryModal');
    const successModalEl = document.getElementById('successModal');

    if (shareStoryModalEl && successModalEl) {
        const shareStoryModal = new bootstrap.Modal(shareStoryModalEl);
        const successModal = new bootstrap.Modal(successModalEl);
    }
});