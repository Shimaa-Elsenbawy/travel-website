document.addEventListener("DOMContentLoaded", () => {
    const modeRadios = document.querySelectorAll("input[name='mode']");
    const serviceFilter = document.getElementById("serviceFilter");
    const activityFilter = document.getElementById("activityFilter");
    const resultsSection = document.getElementById("results");
    const checkIn = document.getElementById("checkIn");
    const checkOut = document.getElementById("checkOut");

    // Set default dates (today and tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    checkIn.valueAsDate = today;
    checkOut.valueAsDate = tomorrow;

    // Sample data with more properties
    const places = [
        { 
            name: "Desert Safari Camp", 
            type: "activity", 
            destination: "cairo", 
            services: [], 
            price: 120, 
            rating: 4.8, 
            activity: "safari", 
            image: "safari.jpg",
            description: "Experience the thrill of the desert with our guided safari tours."
        },
        { 
            name: "Nile River Cruise", 
            type: "activity", 
            destination: "cairo", 
            services: [], 
            price: 180, 
            rating: 4.7, 
            activity: "cruise", 
            image: "cruise.jpg",
            description: "Enjoy a luxurious cruise along the historic Nile River."
        },
        { 
            name: "Tokyo Grand Hotel", 
            type: "hotel", 
            destination: "tokyo", 
            services: ["wifi", "breakfast"], 
            price: 200, 
            rating: 4.3, 
            image: "tokyo-grand.jpg",
            description: "5-star luxury in the heart of Tokyo with amazing city views."
        },
        { 
            name: "Tokyo Capsule Stay", 
            type: "hotel", 
            destination: "tokyo", 
            services: ["wifi"], 
            price: 90, 
            rating: 4.1, 
            image: "capsule.jpg",
            description: "Experience unique Japanese capsule hotel accommodation."
        },
        { 
            name: "Paris Luxury Inn", 
            type: "hotel", 
            destination: "paris", 
            services: ["wifi", "pool"], 
            price: 250, 
            rating: 4.6, 
            image: "paris-lux.jpg",
            description: "Boutique hotel with Eiffel Tower views and rooftop pool."
        },
        { 
            name: "Paris Budget Lodge", 
            type: "hotel", 
            destination: "paris", 
            services: ["breakfast"], 
            price: 110, 
            rating: 4.0, 
            image: "paris-budget.jpg",
            description: "Affordable accommodation in central Paris."
        },
        { 
            name: "Mount Fuji Hiking Tour", 
            type: "activity", 
            destination: "tokyo", 
            services: [], 
            price: 150, 
            rating: 4.9, 
            activity: "hiking", 
            image: "fuji.jpg",
            description: "Guided hiking tours to Japan's most iconic mountain."
        },
        { 
            name: "Louvre Guided Tour", 
            type: "activity", 
            destination: "paris", 
            services: [], 
            price: 75, 
            rating: 4.5, 
            activity: "museum", 
            image: "louvre.jpeg",
            description: "Skip-the-line access with expert art historian guide."
        },
        { 
            name: "Giza Pyramid Adventure", 
            type: "activity", 
            destination: "cairo", 
            services: [], 
            price: 130, 
            rating: 4.8, 
            activity: "historic", 
            image: "giza.jpg",
            description: "Private tours of the ancient pyramids with Egyptologist guide."
        },
        { 
            name: "Eiffel Tower Picnic", 
            type: "activity", 
            destination: "paris", 
            services: [], 
            price: 95, 
            rating: 4.7, 
            activity: "picnic", 
            image: "eiffel.jpg",
            description: "Romantic picnic with champagne at the Eiffel Tower."
        },
        { 
            name: "Tokyo Zen Retreat", 
            type: "hotel", 
            destination: "tokyo", 
            services: ["wifi", "breakfast", "pool"], 
            price: 220, 
            rating: 4.5, 
            image: "zen-retreat.jpg",
            description: "Traditional Japanese ryokan with modern amenities."
        },
        { 
            name: "Seine River Romantic Cruise", 
            type: "activity", 
            destination: "paris", 
            services: [], 
            price: 145, 
            rating: 4.9, 
            activity: "romance", 
            image: "seine.jpg",
            description: "Evening cruise with dinner and live music on the Seine."
        }
    ];

    // Toggle between hotel and activity filters
    modeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "hotel") {
                serviceFilter.classList.remove("hidden");
                activityFilter.classList.add("hidden");
            } else {
                serviceFilter.classList.add("hidden");
                activityFilter.classList.remove("hidden");
            }
            renderPlaces();
        });
    });

    // Main rendering function
    function renderPlaces() {
        const mode = document.querySelector("input[name='mode']:checked").value;
        const destination = document.getElementById("destinationFilter").value;
        const service = serviceFilter.value;
        const activity = activityFilter.value;
        const sort = document.getElementById("sortFilter").value;

        let filtered = places.filter(place => place.type === mode);

        if (destination !== "all") filtered = filtered.filter(p => p.destination === destination);
        if (mode === "hotel" && service !== "all") filtered = filtered.filter(p => p.services.includes(service));
        if (mode === "activity" && activity !== "all") filtered = filtered.filter(p => p.activity === activity);

        if (sort === "price") filtered.sort((a, b) => a.price - b.price);
        if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
        if (sort === "services") filtered.sort((a, b) => (b.services?.length || 0) - (a.services?.length || 0));

        resultsSection.innerHTML = filtered.map(place => {
            const datePrice = calculateDatePrice(place.price);
            return `
                <div class="place-card">
                    <div class="img-wrapper">
                        <img src="../images/${place.image}" alt="${place.name}" class="place-img" onerror="this.src='images/placeholder.jpg'; this.alt='Image not available'" />
                        <div class="overlay">
                            <button class="add-trip-btn">Add to Trip</button>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3>${place.name}</h3>
                        <p>${place.description}</p>
                        <p><strong>Destination:</strong> ${place.destination.charAt(0).toUpperCase() + place.destination.slice(1)}</p>
                        <p><strong>Price:</strong> $${place.price} per night${datePrice ? ` → <strong>$${datePrice}</strong> total` : ''}</p>
                        <p><strong>Rating:</strong> <span class="stars">${'★'.repeat(Math.floor(place.rating))}${place.rating % 1 >= 0.5 ? '½' : ''} (${place.rating})</span></p>
                        <div class="rate-input">
                            <label for="rate-${place.name.replace(/\s+/g, '-')}">Your Rating:</label>
                            <input type="number" min="1" max="5" step="0.1" id="rate-${place.name.replace(/\s+/g, '-')}" 
                                   placeholder="1-5" value="${localStorage.getItem(`rating-${place.name}`) || ''}" />
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // Add event listeners to rating inputs
        document.querySelectorAll('.rate-input input').forEach(input => {
            input.addEventListener('change', (e) => {
                const rating = parseFloat(e.target.value);
                if (rating >= 1 && rating <= 5) {
                    const placeName = e.target.id.replace('rate-', '').replace(/-/g, ' ');
                    localStorage.setItem(`rating-${placeName}`, rating);
                }
            });
        });
    }

    // Calculate total price based on dates
    function calculateDatePrice(basePrice) {
        const inDate = new Date(checkIn.value);
        const outDate = new Date(checkOut.value);
        if (!isNaN(inDate) && !isNaN(outDate) && outDate > inDate) {
            const days = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
            return basePrice * days;
        }
        return null;
    }

    // Date validation
    function validateDates() {
        const inDate = new Date(checkIn.value);
        const outDate = new Date(checkOut.value);
        if (outDate <= inDate) {
            alert('Check-out date must be after check-in date');
            checkOut.value = '';
        }
        renderPlaces();
    }

    // Event listeners
    checkOut.addEventListener('change', validateDates);
    checkIn.addEventListener('change', () => {
        const inDate = new Date(checkIn.value);
        const outDate = new Date(checkOut.value);
        if (!isNaN(inDate) && (isNaN(outDate) || outDate <= inDate)) {
            const nextDay = new Date(inDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOut.valueAsDate = nextDay;
        }
        renderPlaces();
    });

    [
        "destinationFilter", "serviceFilter", "activityFilter", "sortFilter"
    ].forEach(id => document.getElementById(id).addEventListener("change", renderPlaces));

    // Initial render
    renderPlaces();

    // Add to trip functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-trip-btn')) {
            const card = e.target.closest('.place-card');
            const placeName = card.querySelector('h3').textContent;
            alert(`Added ${placeName} to your trip!`);
            // In a real app, you would add this to a trip cart or saved items
        }
    });
});

// Handle image errors globally
window.onerror = function(msg, url, line, col, error) {
    if (msg.includes('Failed to load resource')) {
        return true; // Suppress error messages for missing images
    }
    return false;
};