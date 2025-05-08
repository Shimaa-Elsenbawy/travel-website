const form = document.querySelector(".form");
const confirmation = document.getElementById("confirmation");
window.addEventListener("load", () => {
    confirmation.style.display = "none";
});
form.addEventListener("submit", function (e) {
    e.preventDefault();
    confirmation.style.display = "block";
    setTimeout(() => confirmation.style.display = "none", 4000);
    form.reset();
});
