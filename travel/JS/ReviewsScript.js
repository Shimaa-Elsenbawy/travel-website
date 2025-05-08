// Initialize reviews from localStorage or use default reviews
let reviews = JSON.parse(localStorage.getItem('reviews')) || [
    {
        id: 1,
        name: 'John Doe',
        rating: 5,
        comment: 'Great service! Would definitely recommend.',
        date: '2024-03-15',
        likes: 12,
        dislikes: 2,
        replies: []
    },
    {
        id: 2,
        name: 'Jane Smith',
        rating: 4,
        comment: 'Good experience overall, but could be better.',
        date: '2024-03-14',
        likes: 8,
        dislikes: 1,
        replies: []
    }
];

// DOM Elements
const reviewsContainer = document.querySelector('.reviews-container');
const reviewForm = document.getElementById('review-form');
const themeToggle = document.getElementById('theme-toggle');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const ratingStars = document.querySelectorAll('.rating-stars i');
const ratingInput = document.getElementById('rating');

// Slider state
let currentSlide = 0;
const reviewsPerSlide = window.innerWidth > 768 ? 3 : 1;

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderReviews();
    setupEventListeners();
    checkTheme();
});

// Event Listeners
function setupEventListeners() {
    // Form submission
    reviewForm.addEventListener('submit', handleReviewSubmit);

    // Rating stars
    ratingStars.forEach(star => {
        star.addEventListener('click', () => handleRatingClick(star));
    });

    // Slider navigation
    prevBtn.addEventListener('click', () => navigateSlider('prev'));
    nextBtn.addEventListener('click', () => navigateSlider('next'));

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Window resize
    window.addEventListener('resize', handleResize);

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Handle review submission
function handleReviewSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    const newReview = {
        id: Date.now(),
        name,
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        dislikes: 0,
        replies: []
    };

    reviews.unshift(newReview);
    saveReviews();
    renderReviews();
    reviewForm.reset();
    resetRatingStars();
}

// Handle rating click
function handleRatingClick(star) {
    const rating = parseInt(star.dataset.rating);
    ratingInput.value = rating;
    
    ratingStars.forEach((s, index) => {
        if (index < rating) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

// Reset rating stars
function resetRatingStars() {
    ratingStars.forEach(star => star.classList.remove('active'));
    ratingInput.value = '';
}

// Handle slider navigation
function navigateSlider(direction) {
    const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);
    
    if (direction === 'prev') {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    } else {
        currentSlide = (currentSlide + 1) % totalSlides;
    }
    
    updateSliderPosition();
}

// Update slider position
function updateSliderPosition() {
    const offset = currentSlide * reviewsPerSlide;
    reviewsContainer.style.transform = `translateX(-${offset * 100}%)`;
}

// Handle window resize
function handleResize() {
    const newReviewsPerSlide = window.innerWidth > 768 ? 3 : 1;
    if (newReviewsPerSlide !== reviewsPerSlide) {
        currentSlide = 0;
        updateSliderPosition();
    }
}

// Toggle theme
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateThemeIcon(isDark);
}

// Update theme icon
function updateThemeIcon(isDark) {
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Check saved theme
function checkTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme === 'dark');
}

// Save reviews to localStorage
function saveReviews() {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

// Render reviews
function renderReviews() {
    reviewsContainer.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsContainer.appendChild(reviewElement);
    });

    updateSliderPosition();
}

// Create review element
function createReviewElement(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="avatar">${review.name.charAt(0)}</div>
            <div>
                <h3>${review.name}</h3>
                <div class="rating-stars">
                    ${Array(5).fill().map((_, i) => `
                        <i class="fas fa-star ${i < review.rating ? 'active' : ''}"></i>
                    `).join('')}
                </div>
            </div>
        </div>
        <p class="review-date">${review.date}</p>
        <p class="review-comment">${review.comment}</p>
        <div class="review-actions">
            <button class="action-btn like-btn" data-id="${review.id}">
                <i class="fas fa-thumbs-up"></i> ${review.likes}
            </button>
            <button class="action-btn dislike-btn" data-id="${review.id}">
                <i class="fas fa-thumbs-down"></i> ${review.dislikes}
            </button>
            <button class="action-btn reply-btn" data-id="${review.id}">
                <i class="fas fa-reply"></i> Reply
            </button>
        </div>
        <div class="replies-container" id="replies-${review.id}">
            ${review.replies.map(reply => `
                <div class="reply">
                    <strong>${reply.name}</strong>
                    <p>${reply.comment}</p>
                    <small>${reply.date}</small>
                </div>
            `).join('')}
        </div>
    `;

    // Add event listeners for actions
    const likeBtn = reviewCard.querySelector('.like-btn');
    const dislikeBtn = reviewCard.querySelector('.dislike-btn');
    const replyBtn = reviewCard.querySelector('.reply-btn');

    likeBtn.addEventListener('click', () => handleReaction(review.id, 'like'));
    dislikeBtn.addEventListener('click', () => handleReaction(review.id, 'dislike'));
    replyBtn.addEventListener('click', () => showReplyForm(review.id));

    return reviewCard;
}

// Handle reactions (like/dislike)
function handleReaction(reviewId, type) {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    const hasLiked = localStorage.getItem(`liked-${reviewId}`);
    const hasDisliked = localStorage.getItem(`disliked-${reviewId}`);

    if (type === 'like') {
        if (hasLiked) {
            review.likes--;
            localStorage.removeItem(`liked-${reviewId}`);
        } else {
            review.likes++;
            localStorage.setItem(`liked-${reviewId}`, 'true');
            if (hasDisliked) {
                review.dislikes--;
                localStorage.removeItem(`disliked-${reviewId}`);
            }
        }
    } else {
        if (hasDisliked) {
            review.dislikes--;
            localStorage.removeItem(`disliked-${reviewId}`);
        } else {
            review.dislikes++;
            localStorage.setItem(`disliked-${reviewId}`, 'true');
            if (hasLiked) {
                review.likes--;
                localStorage.removeItem(`liked-${reviewId}`);
            }
        }
    }

    saveReviews();
    renderReviews();
}

// Show reply form
function showReplyForm(reviewId) {
    const repliesContainer = document.getElementById(`replies-${reviewId}`);
    const replyForm = document.createElement('form');
    replyForm.className = 'reply-form';
    replyForm.innerHTML = `
        <input type="text" placeholder="Your name" required>
        <textarea placeholder="Your reply" required></textarea>
        <button type="submit">Submit Reply</button>
    `;

    replyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = replyForm.querySelector('input').value;
        const comment = replyForm.querySelector('textarea').value;

        const review = reviews.find(r => r.id === reviewId);
        if (review) {
            review.replies.push({
                name,
                comment,
                date: new Date().toISOString().split('T')[0]
            });
            saveReviews();
            renderReviews();
        }
    });

    repliesContainer.appendChild(replyForm);
} 