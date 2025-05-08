const form = document.querySelector(".form");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  confirmation.style.display = "block";
  setTimeout(() => confirmation.style.display = "none", 4000);
  form.reset();
});