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
