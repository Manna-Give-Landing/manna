document.getElementById("waitlist-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var email = document.getElementById("email").value.trim();
  if (email) {
    console.log("Waitlist signup:", email);
    document.getElementById("email").value = "";
  }
});
