const form = document.querySelector("#auth-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector('button[type="submit"]');
const apiBaseUrl = window.ORBIT_API_BASE_URL || "";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const mode = form.dataset.mode;
  const formData = new FormData(form);
  const username = formData.get("username").trim();
  const password = formData.get("password");

  if (mode === "register" && password !== formData.get("confirmPassword")) {
    message.textContent = "The passwords do not match.";
    return;
  }

  message.textContent = "Please wait...";
  submitButton.disabled = true;

  try {
    //  these routes must accept JSON and return JSON
    const response = await fetch(`${apiBaseUrl}/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      message.textContent = result.message || result.error || "The request failed.";
      return;
    }

    window.location.href = "index.html";
  } catch (error) {
    message.textContent = "need to connect still!";
  } finally {
    submitButton.disabled = false;
  }
});
