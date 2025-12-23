document.addEventListener("DOMContentLoaded", () => {
    console.log("SUDI Global Investment Website Loaded");

    // مثال تطوير لاحق:
    // Animation on scroll
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = "translateY(40px)";
    });

    window.addEventListener("scroll", () => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                card.style.opacity = 1;
                card.style.transform = "translateY(0)";
                card.style.transition = "0.6s ease";
            }
        });
    });
});
