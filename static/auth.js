// The login and register forms post straight to Flask (/login and /register
// in flask_auth_api.py), which re-renders the page with any error message.
// This file only does the checks that should happen before the form is sent.
const form = document.querySelector("#auth-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", (event) => {
  const formData = new FormData(form);

  if (form.dataset.mode === "register" && formData.get("password") !== formData.get("confirmPassword")) {
    event.preventDefault();
    message.textContent = "The passwords do not match.";
    return;
  }

  message.textContent = "Please wait...";
  submitButton.disabled = true;
});
